import './App.css';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Form, Navbar, Modal, Card} from 'react-bootstrap'; //,Card
import { useEffect, useState } from 'react'; //useEffect

function generateHexString(length) {
  var ret = "";
  while (ret.length < length) {
    ret += Math.random().toString(16).substring(2);
  }
  return ret.substring(0,length);
}

function App() {

  ///////////////////// Modal Form Visibility Handler  /////////////////////
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  //Array to be pushed to local storage
  const [items,setItems] = useState([]);

  ///////////////////// Modal Form Handler  /////////////////////
  //Form Values
  const [name, setName] = useState('');
  const handleChangeName = (e) => setName(e.target.value);
  const [address, setAddress] = useState('');
  const handleChangeAddy = (e) => setAddress(e.target.value);
  const [number, setNumber] = useState('');
  const handleChangeNum = (e) => setNumber(e.target.value);

  //Form Item Type
  const [ type, setType ] = useState('');

  //Type Radio Functionality
  const typeRadios = ["Design", "Development", "Non-specific"];
  const [selected, setSelected] = useState();

  const handleClick = radio => event => {
    setSelected(radio);
  }

  useEffect (()=>{
    if(selected === undefined){
      setType("#Non-specific");
    } else {
      setType('#' + selected);
    }
    // console.log(selected, type);
  },[selected, type]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const grandID = generateHexString(10);
    const newItems = {
      name: name,
      address: address,
      number: number,
      type: type,
      id: grandID
   };

    setItems(oldItems => [...oldItems, newItems]);

    //setting back to blank
    setName('');
    setAddress('');
    setNumber('');
    setSelected(undefined);
  }

  ///////////////////// Item Deletion Handler  /////////////////////
  const handleDelete = (id) =>{
    // assigning the list to temp variable
    const temp = [...items];

    var index = temp.findIndex(function(o){
      return o.id === id;
    })

    // removing the element using splice
    temp.splice(index, 1);

    // updating the list
    setItems(temp);
  }

  ///////////////////// Search Bar Functionality  /////////////////////
  const [searchValue, setSearchValue] = useState('');

  const handleSearchChange = (e) => {
   setSearchValue(e.target.value);
  };

  const matchSearch = (item) => {
    if (searchValue === ''){
      return item;
    }
    else if (item.name.toLowerCase().includes(searchValue.toLowerCase()) || item.type.toLowerCase().includes(searchValue.toLowerCase())){
      return item;
    }
  }

  ///////////////////// Checkbox filter  /////////////////////
  const filterCheckBoxes = ["All", "Design", "Development"];
  const [checkSelected, setCheckSelected] = useState();

  const handleCheckbox = checkbox => event => {
    setCheckSelected("#" + checkbox);
  }

  const matchFilter = (item) => {
    if (checkSelected === undefined){
      return item;
    } else if (checkSelected === "#All"){
      return item;
    } else if (item.type === checkSelected){
      return item;
    }
  }


  ///////////////////// Search Results Handler  /////////////////////
  let filter1 = items.filter(matchSearch)
  let filteredItems = filter1.filter(matchFilter)



  ///////////////////// Local Storage Handler  /////////////////////
  //Persists Local Storage
  useEffect(()=>{
    const data = localStorage.getItem('data')
    
    if(data){
      setItems(JSON.parse(data))
      }
    },[]);

  useEffect(()=>{
    localStorage.setItem('data', JSON.stringify(items));
  },[items]);
  
  return (
    <div className="App">
      <Container>
        <Navbar className='white-bg my-3' variant="light" expand='lg'>
          <Container>
            <Navbar.Brand><strong>ClientSYDE</strong></Navbar.Brand>
            <Button variant="dark" onClick={handleShow}><strong>＋</strong></Button>
          </Container>
        </Navbar>

        {/* ///////////////////// Hidden Modal Form /////////////////////*/}
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Add</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleSubmit}>
          <Modal.Body>
              <Form.Group className="mb-3" controlId="modalFormName">
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" placeholder="Name" value={name} onChange={handleChangeName} name="name" required/>
              </Form.Group>
              
              <Form.Group className="mb-3" controlId="modalFormAddress">
                <Form.Label>Address</Form.Label>
                <Form.Control type="text" placeholder="Address" value={address} onChange={handleChangeAddy} name="address" required/>
              </Form.Group>

              <Form.Group className="mb-3"controlId="modalFormNumber">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control type="text" placeholder="Phone Number" value={number} onChange={handleChangeNum} name="number" required/>
              </Form.Group>

              <Form.Group controlId="modalFormtag" required>
                <Form.Label>Work Type</Form.Label>
                <div className='d-flex gap-3'>
                   {typeRadios && typeRadios.map(r => {
                      return (
                          <label>
                            <div className='d-flex gap-1'>
                              <Form.Check onClick={handleClick(r)} type="radio" name="settings" />
                              {r}
                            </div>
                          </label>
                      )
                    })}
                </div>

              </Form.Group>
            
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button type='submit' variant="primary" onClick={handleClose}>
              Add
            </Button>
          </Modal.Footer>
          </Form>
        </Modal>

        {/* ///////////////////// Search Bar /////////////////////*/}
        <Form className="mb-5">
          <Form.Group controlId="formBasicSearchBar">
            <Form.Control className='mb-2' type="text" value={searchValue} onChange={handleSearchChange} placeholder="Search..."/>
            
            <div className='d-flex gap-3'>
              <Form.Label>Show: </Form.Label>
              {filterCheckBoxes && filterCheckBoxes.map(r => {
                return (
                    <label>
                      <div className='d-flex gap-1'>
                        <Form.Check onClick={handleCheckbox(r)} name="filter" type='radio' />
                        {r}
                      </div>
                    </label>
                  )
              })}
            </div>
          </Form.Group>
        </Form>

        {/* ///////////////////// Mapped Results /////////////////////*/}
        <Container className="mapped">
          {/* d-flex flex-column gap-3 */}
          <>
            {filteredItems.map((item) =>
              <Card className='items' key={item.id}>
                <Card.Body>
                  <Card.Title className="mt-4">{item.name}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">{item.address}</Card.Subtitle>
                  <Card.Text>
                    {item.number}
                  </Card.Text>
                  <div className="bottom-card">
                    <Card className="p-2"><Card.Text>{item.type}</Card.Text></Card>
                    <Button type='submit' onClick={function(){handleDelete(item.id);}} variant="secondary">
                      Delete
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            )}
          </>
        </Container>

      </Container>
    </div>
  );
}

export default App;



/*
  For the filter buttons, it will filter the already filtered 
  search list for what falls under the selected options and saves it to a variable
  and that variable is mapped to the user.

*/