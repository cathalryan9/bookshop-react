import React from 'react';
import './App.css';
import { Container,Grid,Switch,TextField, Button } from '@material-ui/core';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';

var SPRING_SERVER_URI = "http://localhost:8080";

class App extends React.Component {
constructor(props){
super()
this.state = {"adminMode":false}
}
	  handleChange = name => event => {
    this.setState({ [name]: event.target.checked });
  };

  render() {

 return (
    <div className="App">
	Admin Mode
      <Switch
        checked={this.state.adminMode}
        onChange={this.handleChange("adminMode")}
        value="adminMode"
        color="primary"
        inputProps={{ 'aria-label': 'primary checkbox' }}
      />
<Container className="bookContainer" maxWidth="sm">
<BookContainer class admin={this.state.adminMode}/>
</Container>
    </div>
  );

  }
}

class BookContainer extends React.Component {
constructor(props){
	super()
this.state = {bookList:[]}
this.getBooks = this.getBooks.bind(this)
}

  componentDidMount() {
        //make call to api for books
        this.getBooks()
  }

   componentDidUpdate(prevProps) {
     if (prevProps.admin !== this.props.admin) {
       this.getBooks();
     }
}

getBooks(){
var request = new XMLHttpRequest();
        request.open('GET', SPRING_SERVER_URI + "/books?admin=" + this.props.admin)
        request.onload = function(){
                console.log(request)
                this.setState({"bookList":JSON.parse(request.response)})
                console.log('meh')
        }.bind(this)
        request.send()


}


render(){
if(!this.state.bookList.length){
	return null;
}

return (<div><Grid container direction="row"
	spacing={2}  
justify="center"
  alignItems="center" ><Grid item xs={12}><Grid container spacing={2}>
{this.state.bookList.map((book) => (<Grid item xs={6}  className="bookTile">
	<div><b>ID: </b>{book["id"]}</div>
	<div><b>Title: </b>{book["title"]}</div>
	<div><b>Authors: </b>{book["author"]}</div>
	<div><b>Categories: </b>{book["categories"]}</div>
	<div><b>ISBN: </b>{book["isbn"]}</div>
	{this.props.admin?(<div><div><b>DateTime Added: </b>{book["dateTimeAdded"]}</div><div><b>Last Modified: </b>{book["lastModified"]}</div></div>):(<div></div>)}
	</Grid>))}{this.props.admin?(<Grid item  className="bookTile" xs={6}><NewBookTile fetchBooksHandler={this.getBooks}/></Grid>):(<div></div>)}</Grid></Grid></Grid></div>)
}
}

class NewBookTile extends React.Component{
constructor(props){
	super()
	this.state = {"id":"",
			"title": "",
			"author":"",
			"categories":"",
			"isbn":""
			}

this.handleChange = this.handleChange.bind(this)
this.addBook = this.addBook.bind(this)
}

handleChange(event){
	console.log(event.target.name)
	this.setState({[event.target.name]:event.target.value})
console.log(event.target.value)
}

addBook(){
	console.log("send")
var request = new XMLHttpRequest();

request.open('POST', SPRING_SERVER_URI + "/books?admin=true")
request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
request.setRequestHeader("Access-Control-Allow-Origin", "*");
var myobj = {
		"id": this.state.id,
		"title": this.state.title,
		"author": this.state.author,
		"categories": this.state.categories,
		"isbn": this.state.isbn
}
console.log(JSON.stringify(myobj))
        request.send(JSON.stringify(myobj))

	this.props.fetchBooksHandler()

this.setState({"id":"",
                        "title": "",
                        "author":"",
                        "categories":"",
                        "isbn":"",
                        })

}

render(){

return (<div><div>New Book</div>
			<TextField id="id-input" name="id" label="ID" value={this.state.id} onChange={this.handleChange} />
			<TextField id="title-input" name="title" label="Title" value={this.state.title} onChange={this.handleChange}/>
			<TextField id="author-input" name="author" label="Author" value={this.state.author} onChange={this.handleChange}/>
			<TextField id="category-input" name="categories" label="Categories" value={this.state.categories} onChange={this.handleChange}/>
			<TextField id="isbn-input" name="isbn" label="ISBN" value={this.state.isbn} onChange={this.handleChange}/>
			<br></br>
			<Button variant="contained-button" color="primary" onClick={this.addBook}>Add</Button>
	</div>
)

}

}

export default App;
