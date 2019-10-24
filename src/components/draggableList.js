import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import React, { Component } from 'react';
import DraggableListItem from './draggableItem';

export default class App extends React.Component {
  onDragStart = (...args) => {
    console.log(...args)
  };
  onDragUpdate = (...args) => {
		console.log(...args)
    /*...*/
  };
  onDragEnd = (...args) => {
		console.log(...args)
    // the only one that is required
  };

  render() {
    return (
      <DragDropContext
        onDragStart={this.onDragStart}
        onDragUpdate={this.onDragUpdate}
        onDragEnd={this.onDragEnd}
      >
				<Droppable droppableId={this.props.id} type="PERSON">
					{(provided, snapshot) => (
						<div
							ref={provided.innerRef}
							style={{ backgroundColor: snapshot.isDraggingOver ? 'blue' : 'grey' }}
							{...provided.droppableProps}
						>
							<h2>I am a droppable!</h2>
							{provided.placeholder}
							{this.props.data.map((item, index) => <DraggableListItem {...{item, index}}></DraggableListItem>)}
						</div>
					)}
				</Droppable>
      </DragDropContext>
    );
  }
}