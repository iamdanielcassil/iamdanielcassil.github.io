import React, { Component } from 'react';
import { Card, Menu, Input } from 'semantic-ui-react'

const styles = theme => ({
  root: {
    textAlign: 'center',
    paddingTop: theme.spacing.unit * 20,
  },
});

export default class DataList extends Component {
	constructor (props) {
		super(props);

		this.state = {};
		this.edit = this.edit.bind(this);
		this.onChange = this.onChange.bind(this);
		this.save = this.save.bind(this);
		this.makeListItem = this.makeListItem.bind(this);
	}

	edit(data) {
		this.setState({
			itemBeingEdited: data
		});
	}

	save() {
		this.props.updateDataItem(this.state.itemBeingEdited);
		this.setState({
			itemBeingEdited: undefined
		});
	}

	onChange(e) {
		let itemBeingEdited = {
			id: this.state.itemBeingEdited.id,
			name: e.target.value
		}

		this.setState({
			itemBeingEdited
		});
	}

	makeListItem(data, index) {
		let itemBeingEdited = this.state.itemBeingEdited;
		let editMenu = null;
		let isBeingEdited = itemBeingEdited && data.id === itemBeingEdited.id;
		let content = (
			<Card.Header>{data.name}</Card.Header>
		)
	
		if (this.props.editable) {
			if (isBeingEdited) {
				content = (
					<Input value={itemBeingEdited.name} onChange={this.onChange}></Input>
				)
				editMenu = (
					<Menu compact>
						<Menu.Item icon="check" onClick={this.save} />
					</Menu>
				);
			} else {
				editMenu = (
					<Menu compact>
						<Menu.Item icon="edit" onClick={() => this.edit(data)} />
					</Menu>
				);
			}
		}

		return (
			<Card fluid key={index}>
				<Card.Content>
					{editMenu}
					{content}
				</Card.Content>
			</Card>
		);
	}

	render() {
		return (
			<div>
				<Card.Group>
					{this.props.data.map(this.makeListItem)}
				</Card.Group>
			</div>
		);
	}
}