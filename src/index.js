import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Button, Grid, Input, Icon, Card, Menu } from 'semantic-ui-react'
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
    this.updateDataItem = this.updateDataItem.bind(this);
    this.onClickCancel = this.onClickCancel.bind(this);
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

  onClickCancel() {
    this.transactor.clear();
    this.forceUpdate();
  }

  onClickSave() {
    this.transactor.save((data) => {
      data.forEach(d => {
        let index = this.data2.findIndex(d2 => d2.id === d.id);

        if (index === -1) {
          console.log('saved transaction data as new item to dataset2', d);
          this.data2.push(d);
        } else {
          console.log('saved transaction data as update to dataset2', d);
          this.data2[index] = d;
        }
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
    let transactions = this.transactor.getLatest();
    let listC =  this.data2.slice();
    
    transactions.forEach(t => {
      let index = listC.findIndex(d2 => d2.id === t.id);

      if (index === -1) {
        listC.push(t);
      } else {
        listC[index] = t;
      }
    })

    return listC;
  }

  updateDataItem(data) {
    this.transactor.add(data.id, data);
    this.forceUpdate();
  }

  render() {
    let listB = this.getListB();
    let listC = this.getListC();
    let saveCancelMenu = (
      <Menu.Menu position="right">
        <Menu.Item>
          <Button variant="raised" color="grey" onClick={this.onClickCancel}>
            Cancel
          </Button>
        </Menu.Item>
        <Menu.Item>
          <Button variant="raised" color="blue" onClick={this.onClickSave}>
            Save
          </Button>
        </Menu.Item>
      </Menu.Menu>
    )

    return (
      <div style={{ margin: 20 }}>
        <Grid container columns={3} divided>
          <Grid.Row>
            <Menu inverted fixed="top">
              <Menu.Item icon='undo' color="grey" onClick={this.onClickUndo}/>
              <Menu.Item icon='redo' color="grey" onClick={this.onClickRedo}/>
              
                {listB.length > 0 ? saveCancelMenu : ''}
              
            </Menu>
          </Grid.Row>
          <Grid.Column style={{ minHeight: 600 }} key="1">
            <Card fluid={true}>
              <Card.Header textAlign="center" style={{ paddingTop: 10, paddingBottom: 10 }}>
                Create New Transaction
              </Card.Header>
              <Card.Content textAlign="center">
                <Input fluid focus value={this.state.inputValue} placeholder='name' onChange={this.onInputChange}/>
                <Button style={{ marginTop: 5 }} variant="raised" color="green" onClick={this.onClickAdd}>
                  Add
                </Button>
              </Card.Content>
            </Card>
          </Grid.Column>
          <Grid.Column key="2">
            <Card fluid={true}>
              <Card.Header textAlign="center" style={{ paddingTop: 10, paddingBottom: 10 }}>
                Transactions
              </Card.Header>
              <Card.Content>
                <TList {...{data: listB}} />
              </Card.Content>
            </Card>
          </Grid.Column>
          <Grid.Column key="3">
            <Card fluid={true}>
              <Card.Header textAlign="center" style={{ paddingTop: 10, paddingBottom: 10 }}>
                Data Set 2 with Transactions superimposed
              </Card.Header>
              <Card.Content>
                <TList {...{data: listC, editable: true, updateDataItem: this.updateDataItem}} />
              </Card.Content>
            </Card>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
  
}
 
ReactDOM.render(<App />, document.querySelector('#app'));