import React, { Component } from "react";
import axios from "axios";
import classnames from "classnames";

import Loading from "./Loading";
import Panel from "./Panel";

import {
	getTotalInterviews,
	getLeastPopularTimeSlot,
	getMostPopularDay,
	getInterviewsPerDay,
} from "helpers/selectors";
import { setInterview } from "helpers/reducers";

const data = [
	{
		id: 1,
		label: "Total Interviews",
		getValue: getTotalInterviews,
	},
	{
		id: 2,
		label: "Least Popular Time Slot",
		getValue: getLeastPopularTimeSlot,
	},
	{
		id: 3,
		label: "Most Popular Day",
		getValue: getMostPopularDay,
	},
	{
		id: 4,
		label: "Interviews Per Day",
		getValue: getInterviewsPerDay,
	},
];
class Dashboard extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.state = {
			loading: true,
			focused: null,
			days: [],
			appointments: {},
			interviewers: {},
		};
		this.socket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);

		this.handleClickFocuse = this.handleClickFocuse.bind(this);
	}

	componentDidMount() {
		const focused = JSON.parse(localStorage.getItem("focused"));

		if (focused) {
			this.setState({ focused });
		}
		Promise.all([
			axios.get("/api/days"),
			axios.get("/api/appointments"),
			axios.get("/api/interviewers"),
		]).then(([days, appointments, interviewers]) => {
			this.setState({
				loading: false,
				days: days.data,
				appointments: appointments.data,
				interviewers: interviewers.data,
			});
		});
		this.socket.onmessage = (event) => {
			const data = JSON.parse(event.data);

			if (typeof data === "object" && data.type === "SET_INTERVIEW") {
				this.setState((previousState) =>
					setInterview(previousState, data.id, data.interview)
				);
			}
		};
	}

	componentDidUpdate(previousProps, previousState) {
		if (previousState.focused !== this.state.focused) {
			localStorage.setItem("focused", JSON.stringify(this.state.focused));
		}
	}

	componentWillUnmount() {
		this.socket.close();
	}

	handleClickFocuse = (id) => {
		this.setState((prev) => ({
			focused: prev.focused !== null ? null : id,
		}));
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
						value={d.getValue(this.state)}
						focused={this.state.focused}
					/>
				))}
			</main>
		);
	}
}

export default Dashboard;
