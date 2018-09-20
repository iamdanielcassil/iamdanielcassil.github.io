import React from 'react';
import { List } from 'semantic-ui-react'
 
const styles = theme => ({
  root: {
    textAlign: 'center',
    paddingTop: theme.spacing.unit * 20,
  },
});

function makeListItem(data) {
	return (
		<List.Item key={data.id}>
			<List.Content>
				<List.Header>{data.name}</List.Header>
				{data.details}
			</List.Content>
		</List.Item>
	);
}

function list(props) {
  return (
		<div>
			<List celled>
				{props.listA.map(d => makeListItem(d))}
			</List>
			<List celled>
				{props.listB.map(d => makeListItem(d))}
			</List>
		</div>
	);
}
 
export default list;