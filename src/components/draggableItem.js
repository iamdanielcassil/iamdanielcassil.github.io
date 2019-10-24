import { Draggable } from 'react-beautiful-dnd';
import React, { Component } from 'react';


export default class App extends React.Component {
 
	render() {
		let item = this.props.item;

		return (
			<Draggable draggableId={item.id} index={this.props.index} type="PERSON">
				{(provided, snapshot) => (
					<div
						ref={provided.innerRef}
						{...provided.draggableProps}
						{...provided.dragHandleProps}
					>
						<h4>{item.name}</h4>
						<h4>{item.id}</h4>
						</div>
				)}
			</Draggable>
		);
	};
};