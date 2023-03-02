import React, { Component } from "react";

import Loading from "./Loading";

import classnames from "classnames";
import Panel from "./Panel";

const data = [
	{
		id: 1,
		label: "Total Interviews",
		value: 6,
	},
	{
		id: 2,
		label: "Least Popular Time Slot",
		value: "1pm",
	},
	{
		id: 3,
		label: "Most Popular Day",
		value: "Wednesday",
	},
	{
		id: 4,
		label: "Interviews Per Day",
		value: "2.3",
	},
];
class Dashboard extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.state = { loading: false, focused: null };
		this.handleClickFocuse = this.handleClickFocuse.bind(this);
	}

	handleClickFocuse = (id) => {
		console.log(this.state.focused, id);
		if (this.state.focused) {
			this.setState({ focused: null });
		} else {
			this.setState({ focused: id });
		}
	};
	render() {
		const dashboardClasses = classnames("dashboard", {
			"dashboard--focused": this.state.focused,
		});
		if (this.state.loading) {
			return <Loading />;
		}
		const focusedData = this.state.focused
			? data.filter((d) => d.id === this.state.focused)
			: data;

		return (
			<main className={dashboardClasses}>
				{focusedData.map((d) => (
					<Panel
						onClick={this.handleClickFocuse}
						id={d.id}
						key={d.id}
						label={d.label}
						value={d.value}
						focused={this.state.focused}
					/>
				))}
			</main>
		);
	}
}

export default Dashboard;
