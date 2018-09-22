import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Button, Grid, Input, Image, Card, Menu } from 'semantic-ui-react'
import TList from './components/editableList';
import Transactor from 'sequence-transactor';

/**
 * This demo site was quickly thrown together, please forgive the code mess.
 * @author Daniel Cassil
 */
 
class App extends Component {

  constructor(props) {
    super(props)
    this.transactor = Transactor.create();

    this.state = {
      inputValue: ''
    };

    this.nextId = 3
    this.data2 = [
      {id: 1, name: 'james Austin'},
    ];

    this.onClickAdd = this.onClickAdd.bind(this);
    this.onClickUndo = this.onClickUndo.bind(this);
    this.onClickRedo = this.onClickRedo.bind(this);
    this.onClickSave = this.onClickSave.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
    this.updateDataItem = this.updateDataItem.bind(this);
    this.onClickCancel = this.onClickCancel.bind(this);
  }
  
  /**
   * add transaction click handler
   */
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

  /**
   * undo last transaction click handler
   */
  onClickUndo() {
    this.transactor.back();
    this.forceUpdate();
  }

  /**
   * redo last undone transaction click handler
   */
  onClickRedo() {
    this.transactor.forward();
    this.forceUpdate();
  }

  /**
   * cancel and clear transactions click handler
   */
  onClickCancel() {
    this.transactor.clear();
    this.forceUpdate();
  }

  /**
   * save transactions click handler
   */
  onClickSave() {
    let saveFunction = (data) => {
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
    }

    this.transactor.saveLatestEdge(saveFunction).then(() => {
      this.transactor.clear();
      this.forceUpdate();
    })
  }

  /**
   * editable data item change handler
   * @param {Event} e 
   */
  onInputChange(e) {
    this.setState({
      inputValue: e.target.value
    });
  }

  /**
   * get transactions from transactor
   */
  getTransactions() {
    return this.transactor.get();
  }

  /**
   * get list c, data + transactions
   */
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

  /**
   * update editable field save click handler
   * @param {*} data 
   */
  updateDataItem(data) {
    this.transactor.add(data.id, data);
    this.forceUpdate();
  }

  render() {
    let listB = this.getTransactions();
    let listC = this.getListC();
    let saveCancelMenu = (
      <Menu.Menu position="right">
        <Menu.Item fitted="vertically">
          <Button size="massive" secondary color="grey" onClick={this.onClickCancel}>
            Cancel
          </Button>
        </Menu.Item>
        <Menu.Item>
          <Button color="blue" size="mini" onClick={this.onClickSave}>
            Save
          </Button>
        </Menu.Item>
      </Menu.Menu>
    );
    let undoMenu = (
      <Menu.Menu size="mini" position="left">
        <Menu.Item size="mini" fitted="vertically" icon='undo' color="grey" onClick={this.onClickUndo}/>
        <Menu.Item size="mini" fitted="vertically" icon='redo' color="grey" onClick={this.onClickRedo}/>
      </Menu.Menu>
    )

    return (
      <div style={{ margin: 20 }}>
        <Grid container columns={3} divided>
        <Grid.Row centered textAlign="center">
        <div><Image src="icon.png" size="tiny"/></div>
        </Grid.Row>
          <Grid.Row>
            <Menu borderless secondary fluid>
              {undoMenu}
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