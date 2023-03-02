import React, { Component } from "react";

export default class Panel extends Component {
	// constructor(props) {
	// 	super(props);
	// }
	render() {
		const { label, value, onClick, id, focused } = this.props;

		return (
			<section
				className='dashboard__panel'
				onClick={() => onClick(id)}>
				<h1 className='dashboard__panel-header'>{label}</h1>
				<p className='dashboard__panel-value'>{value}</p>
			</section>
		);
	}
}
