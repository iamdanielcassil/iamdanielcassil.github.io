import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Button } from 'semantic-ui-react'
import TList from './components/list';
import Transactor from 'sequence-transactor';
 
class App extends Component {



  constructor(props) {
    super(props)

    this.data = [
      {id: 1, name: 'bob', details: 'bob is cool'},
      {id: 2, name: 'dave', details: 'bob is cool'},
      {id: 3, name: 'mike', details: 'bob is cool'},
      {id: 4, name: 'dan', details: 'bob is cool'}
    ],

    this.transactor = Transactor.create();
    
    this.state = {
      listA: this.data,
      listB: []
    }

    this.onClickAdd = this.onClickAdd.bind(this);
    this.onClickUndo = this.onClickUndo.bind(this);
    this.onClickRedo = this.onClickRedo.bind(this);
  }
  
  onClickAdd() {
    let listA = this.state.listA;
    let next = listA.slice().pop();

    this.transactor.add(next.id, next);
    this.updateAfter();
  }

  onClickUndo() {
    this.transactor.back();

    this.updateAfter();
  }

  onClickRedo() {
    this.transactor.forward();

    this.updateAfter();
  }

  updateAfter() {
    let listA = this.data;
    let listB = this.transactor.get();

    listA = listA.filter(li => {
      return !listB.some(lib => {
        return lib.id === li.id;
      });
    });

    this.setState({
      listB,
      listA
    });
  }

  render() {
    return (
      <div>
        <TList {...{listA: this.state.listA, listB: this.state.listB}} />
        <Button variant="raised" color="blue" onClick={this.onClickAdd}>
         Add Transaction
        </Button>
        <Button variant="raised" color="blue" onClick={this.onClickUndo}>
          Undo
        </Button>
        <Button variant="raised" color="blue" onClick={this.onClickRedo}>
          Redo
        </Button>
      </div>
    );
  }
  
}
 
ReactDOM.render(<App />, document.querySelector('#app'));