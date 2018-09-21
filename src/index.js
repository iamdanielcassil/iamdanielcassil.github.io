import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Button, Grid, Input } from 'semantic-ui-react'
import TList from './components/card';
import Transactor from 'sequence-transactor';
 
class App extends Component {

  constructor(props) {
    super(props)
    this.transactor = Transactor.create();

    this.state = {
      inputValue: ''
    };

    this.nextId = 3
    this.data2 = [
      {id: 1, name: 'james'},
      {id: 2, name: 'steve'},
    ];

    this.onClickAdd = this.onClickAdd.bind(this);
    this.onClickUndo = this.onClickUndo.bind(this);
    this.onClickRedo = this.onClickRedo.bind(this);
    this.onClickSave = this.onClickSave.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
  }
  
  onClickAdd() {
    let data = {
      id: this.nextId++,
      name: this.state.inputValue,
    } 

    this.transactor.add(this.nextId, data);
    console.log('added transaction with data', data)
    this.setState({
      inputValue: ''
    });
  }

  onClickUndo() {
    this.transactor.back();
    this.forceUpdate();
  }

  onClickRedo() {
    this.transactor.forward();
    this.forceUpdate();
  }

  onClickSave() {
    this.transactor.save((data) => {
      data.forEach(d => {
        console.log('saved transaction data to dataset 2', d);
        this.data2.push(d);
      });
      return Promise.resolve();
    }).then(() => {
      this.transactor.clear();
      this.forceUpdate();
    })
  }

  onInputChange(e) {
    this.setState({
      inputValue: e.target.value
    });
  }

  getListB() {
    return this.transactor.get();
  }

  getListC() {
    let listB = this.transactor.get();
    let listC = this.data2;

    return listC.filter(li => {
      return !listB.some(lib => {
        return lib.id === li.id;
      });
    }).concat(listB);
  }

  render() {
    let listB = this.getListB();
    let listC = this.getListC();

    return (
      <div>
        <Grid container columns={4}>
          <Grid.Column key="1">
            <Button variant="raised" color="green" onClick={this.onClickAdd}>
            Add Transaction
            </Button>
          </Grid.Column>
          <Grid.Column key="2">
            <Button variant="raised" color="grey" onClick={this.onClickUndo}>
              Undo
            </Button>
          </Grid.Column>
          <Grid.Column key="3">
            <Button variant="raised" color="grey" onClick={this.onClickRedo}>
              Redo
            </Button>
          </Grid.Column>
          <Grid.Column key="4">
            <Button variant="raised" color="blue" onClick={this.onClickSave}>
              Save
            </Button>
          </Grid.Column>
        </Grid>
        <Grid container columns={3}>
          <Grid.Column key="1">
            <Input focus value={this.state.inputValue} placeholder='name' onChange={this.onInputChange}/>
            <Button variant="raised" color="green" onClick={this.onClickAdd}>
              Add Transaction
            </Button>
          </Grid.Column>
          <Grid.Column key="2">
            Transactions
            <TList {...{data: listB}} />
          </Grid.Column>
          <Grid.Column key="3">
            Data Set 2 with Transactions superimposed
            <TList {...{data: listC}} />
          </Grid.Column>
        </Grid>
      </div>
    );
  }
  
}
 
ReactDOM.render(<App />, document.querySelector('#app'));