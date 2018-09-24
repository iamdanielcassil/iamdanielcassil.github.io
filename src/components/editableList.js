import React, { Component } from 'react';
import { Card, Segment, Input, Header, Label } from 'semantic-ui-react'

/**
 * This demo site was quickly thrown together, please forgive the code mess.
 * @author Daniel Cassil
 */

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
		this.cancel = this.cancel.bind(this);
		this.makeListItem = this.makeListItem.bind(this);
	}

	edit(data) {
		this.setState({
			itemBeingEdited: data
		});
	}

	delete(data) {
		this.props.deleteDataItem(data);
	}

	save() {
		this.props.updateDataItem(this.state.itemBeingEdited);
		this.setState({
			itemBeingEdited: undefined
		});
	}

	cancel() {
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
		let isBeingEdited = itemBeingEdited && data.id === itemBeingEdited.id;
		let content = null;
	
		if (this.props.editable) {
			if (isBeingEdited) {
				content = (
					<Segment padded >
						<Label.Group as="label" attached="top left">
						<Label as="a" icon="check" onClick={() => this.save(data)}></Label>
						<Label as="a" icon="cancel" onClick={() => this.cancel(data)}></Label>
						</Label.Group>
						
						<Card>
							<Card.Content>
								<Card.Header>
									<Input fluid value={itemBeingEdited.name} onChange={this.onChange}></Input>
								</Card.Header>
							</Card.Content>
						</Card>
					</Segment>
				)
			} else {
				content = (
					<Segment padded >
						<Label as="a" icon="edit" attached="top left" onClick={() => this.edit(data)}></Label>
						<Label as="a" icon="delete" attached="top right" onClick={() => this.delete(data)}></Label>
						<Card>
							<Card.Content>
								<Card.Header as="header">
									{data.name}
								</Card.Header>
							</Card.Content>
						</Card>
					</Segment>
				)
			}
		} else {
			content = (
				<Card.Content>
					<Card.Header>
						{data.data.name}
					</Card.Header>
						<Card.Description>id: {data.id}</Card.Description>
						<Card.Description>options: {Object.keys(data.options).map(k => `${k} = ${data.options[k]}`).join(', ')}</Card.Description>
				</Card.Content>
			)
		}

		return (
			<Card fluid key={index}>
				{content}
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