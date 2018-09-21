import React from 'react';
import { Card } from 'semantic-ui-react'
 
const styles = theme => ({
  root: {
    textAlign: 'center',
    paddingTop: theme.spacing.unit * 20,
  },
});

function makeListItem(data) {
	return (
		<Card key={data.id}>
			<Card.Content>
				<Card.Header>{data.name}</Card.Header>
			</Card.Content>
		</Card>
	);
}

function list(props) {
  return (
		<div>
			<Card.Group>
				{props.data.map(d => makeListItem(d))}
			</Card.Group>
		</div>
	);
}
 
export default list;