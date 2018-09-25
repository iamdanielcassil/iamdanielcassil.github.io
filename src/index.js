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

    this.nextId = 2
    this.data2 = [
      {id: 1, name: 'james Austin'},
    ];

    this.onClickAddSaveable = this.onClickAddSaveable.bind(this);
    this.onClickUndo = this.onClickUndo.bind(this);
    this.onClickRedo = this.onClickRedo.bind(this);
    this.onClickSave = this.onClickSave.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
    this.updateDataItem = this.updateDataItem.bind(this);
    this.deleteDataItem = this.deleteDataItem.bind(this);
    this.onClickCancel = this.onClickCancel.bind(this);
  }
  
  /**
   * add transaction click handler
   */
  createSubRecord(parentId) {
    let data = {
      id: this.nextId++,
      parentId,
      name: `sibling of ${parentId}`,
      details: 'you can create non saveable transactions to effect client side data until save to mimic actions ',
    } 

    this.transactor.add(data.id, data, {save: false, add: true});
    console.log('added transaction with data', data)
    this.setState({
      inputValue: ''
    });
  }

    /**
   * add transaction click handler
   */
  onClickAddSaveable() {
    let data = {
      id: this.nextId++,
      name: this.state.inputValue,
    } 

    this.transactor.add(data.id, data, {add: true});
    console.log('added transaction with data', data)
    this.createSubRecord(data.id);
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
    let put = (data) => {
      data.forEach(d => {
        let index = this.data2.findIndex(d2 => d2.id === d.id);

        if (index === -1) {
         throw(new Error('can not update non existent record'))
        }
  
        console.log('saved transaction update');
        this.data2[index] = d;
      });
    }
    let post = (data) => {
      data.forEach(d => {
        let index = this.data2.findIndex(d2 => d2.id === d.id);

        if (index !== -1) {
          throw(new Error('can not create new record with duplicate id'))
         }

        console.log('saved transaction add');
        this.data2.push(d);
      });
    }
    let del = (data) => {
      data.forEach(d => {
        let index = this.data2.findIndex(d2 => d2.id === d.id);

        if (index === -1) {
         return;
        }
  
        console.log('saved transaction delete');
        this.data2.splice([index], 1);
      });
    }

    this.transactor.saveLatestEdge(put, post, del).then(() => {
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
    return this.transactor.superimpose(this.data2.map(data => {return { id: data.id, data }})).map(t => t.data).filter(t => t.parentId === undefined);
  }

    /**
   * get list c, data + transactions
   */
  getListD() {
    return this.transactor.superimpose(this.data2.map(data => {
      return { id: data.id, data }
    })).map(t => {
      t.data.options = t.options
      return t.data;
    }).filter(t => t.parentId !== undefined);
  }

  /**
   * update editable field save click handler
   * @param {*} data 
   */
  updateDataItem(data) {
    this.transactor.add(data.id, data);
    console.log('added - update - transaction with data', data)
    this.forceUpdate();
  }

  deleteDataItem(data) {
    let siblingTransactions = this.transactor.get().filter(t => t.data.parentId === data.id);
    this.transactor.add(data.id, data, {delete: true});

    siblingTransactions.forEach(st => {
      this.transactor.add(st.id, st.data, {delete: true});
    });

    console.log('added - delete - transaction with data', data)
    this.forceUpdate();
  }

  render() {
    let listB = this.getTransactions();
    let listC = this.getListC();
    let listD = this.getListD();
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
        <Grid container columns={4} divided>
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
            <Card fluid>
              <Card.Header textAlign="center" style={{ paddingTop: 10, paddingBottom: 10 }}>
                Create New Transaction
              </Card.Header>
              <Card.Content textAlign="center">
                <Input fluid focus value={this.state.inputValue} placeholder='name' onChange={this.onInputChange}/>
                <Button style={{ marginTop: 5 }} variant="raised" color="green" onClick={this.onClickAddSaveable}>
                  {'transactor.add({save: true})'} 
                </Button>
              </Card.Content>
            </Card>
          </Grid.Column>
          <Grid.Column key="2">
            <Card fluid={true}>
              <Card.Header textAlign="center" style={{ paddingTop: 10, paddingBottom: 10 }}>
                Transactions - transactor.get()
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
                <TList {...{data: listC, editable: true, updateDataItem: this.updateDataItem, deleteDataItem: this.deleteDataItem}} />
              </Card.Content>
            </Card>
          </Grid.Column>
          <Grid.Column key="4">
            <Card fluid={true}>
              <Card.Header textAlign="center" style={{ paddingTop: 10, paddingBottom: 10 }}>
                Non saveable - system created content
              </Card.Header>
              <Card.Content>
                <TList {...{data: listD}} />
              </Card.Content>
            </Card>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
  
}
 
ReactDOM.render(<App />, document.querySelector('#app'));