import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Button, Grid } from 'semantic-ui-react'
import TList from './components/card';
import Transactor from 'sequence-transactor';
 
class App extends Component {

  constructor(props) {
    super(props)

    this.data = [
      {id: 1, name: 'bob', details: 'bob is cool'},
      {id: 2, name: 'dave', details: 'bob is cool'},
      {id: 3, name: 'mike', details: 'bob is cool'},
      {id: 4, name: 'dan', details: 'bob is cool'}
    ];

    this.data2 = [
      {id: 5, name: 'james', details: 'bob is cool'},
      {id: 6, name: 'steve', details: 'bob is cool'},
    ]


    this.transactor = Transactor.create();
    
    this.state = {
      listA: this.data,
      listB: [],
      listC: this.data2,
    }

    this.onClickAdd = this.onClickAdd.bind(this);
    this.onClickUndo = this.onClickUndo.bind(this);
    this.onClickRedo = this.onClickRedo.bind(this);
  }
  
  onClickAdd() {
    let listA = this.state.listA;

    if (listA.length === 0) {
      return;
    }

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
    let listC = this.data2;

    listA = listA.filter(li => {
      return !listB.some(lib => {
        return lib.id === li.id;
      });
    });

    listC = listC.filter(li => {
      return !listB.some(lib => {
        return lib.id === li.id;
      });
    }).concat(listB);

    this.setState({
      listB,
      listA,
      listC,
    });
  }

  render() {
    return (
      <div>
        <Grid container columns={3}>
          <Grid.Column key="1">
            <Button variant="raised" color="blue" onClick={this.onClickAdd}>
            Add Transaction
            </Button>
          </Grid.Column>
          <Grid.Column key="2">
            <Button variant="raised" color="blue" onClick={this.onClickUndo}>
              Undo
            </Button>
          </Grid.Column>
          <Grid.Column key="3">
            <Button variant="raised" color="blue" onClick={this.onClickRedo}>
              Redo
            </Button>
          </Grid.Column>
        </Grid>
        <Grid container columns={3}>
          <Grid.Column key="1">
            Data Set 1
            <TList {...{data: this.state.listA}} />
          </Grid.Column>
          <Grid.Column key="2">
            Transactions
            <TList {...{data: this.state.listB}} />
          </Grid.Column>
          <Grid.Column key="3">
            Data Set 2 with Transactions superimposed
            <TList {...{data: this.state.listC}} />
          </Grid.Column>
        </Grid>
      </div>
    );
  }
  
}
 
ReactDOM.render(<App />, document.querySelector('#app'));