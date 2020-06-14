import React, { Component } from "react";
import "./css/casovac.css";

class Casovac extends Component {
	state = {
		casFont: 31.5,
		scoreFont: 25,
		nastaveno: false,
		domaciSkore: 0,
		hosteSkore: 0,
		minuty: 0,
		sekundy: -1,
		desetiny: -1,
		pauseTimer: true,
	};
	componentDidMount() {
		let minuty = JSON.parse(localStorage.getItem("minuty"));
		let sekundy = JSON.parse(localStorage.getItem("sekundy"));
		let desetiny = JSON.parse(localStorage.getItem("desetiny"));

		if (!minuty && !sekundy && !desetiny) {
			minuty = 0;
			sekundy = 0;
			desetiny = 0;
		}

		this.updateTime(minuty, sekundy);
		this.setState(
			{ minuty: minuty, sekundy: sekundy, desetiny: desetiny },
			function () {
				this.interval = setInterval(this.updateTime, 1000);
			}
		);

		let casFont = JSON.parse(localStorage.getItem("casFont"));
		let scoreFont = JSON.parse(localStorage.getItem("scoreFont"));

		if (casFont && scoreFont) {
			this.setState({
				casFont: casFont,
				scoreFont: scoreFont,
				nastaveno: true,
			});
		}

		document.addEventListener("keydown", (event) => {
			event.preventDefault();
			event.stopPropagation();
			if (event.code === "KeyQ") {
				this.setState({ domaciSkore: this.state.domaciSkore + 1 });
			} else if (event.code === "KeyW") {
				this.setState({ hosteSkore: this.state.hosteSkore + 1 });
			} else if (event.code === "KeyA" && this.state.domaciSkore > 0) {
				this.setState({ domaciSkore: this.state.domaciSkore - 1 });
			} else if (event.code === "KeyS" && this.state.hosteSkore > 0) {
				this.setState({ hosteSkore: this.state.hosteSkore - 1 });
			} else if (event.code === "Space") {
				if (this.state.pauseTimer) {
					const requestOptions = {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							minuty: this.state.minuty,
							sekundy: this.state.sekundy,
						}),
					};
					fetch(
						"http://127.0.0.1:5000/update_casovac",
						requestOptions
					);
				}
				this.setState({ pauseTimer: !this.state.pauseTimer });
			}
		});

		/*fetch("http://127.0.0.1:5000/main")
			.then((response) => response.json())
			.then((result) => {
				let arr = [];
				for (let zapas of result.zapasy) {
					arr.push(zapas);
				}

				this.setState(
					{
						zapasy: arr,
						casovac: result.casovac,
					},
					function () {
						if (this.interval) {
							clearInterval(this.interval);
						}

						this.interval = setInterval(this.updateTimer, 1000);
					}
				);
			});*/
	}

	componentWillUnmount() {
		clearInterval(this.interval);

		document.removeEventListener("click", this.updateTime, false);
	}

	/*updateTime = () => {
		if (!this.state.pauseTimer) {
			if (this.state.desetiny === 9) {
				this.setState({ sekundy: this.state.sekundy + 1, desetiny: 0 });
			} else {
				this.setState({ desetiny: this.state.desetiny + 1 });
			}
			if (this.state.sekundy === 60) {
				this.setState({ minuty: this.state.minuty + 1, sekundy: 0 });
			}
			localStorage.setItem("minuty", JSON.stringify(this.state.minuty));
			localStorage.setItem("sekundy", JSON.stringify(this.state.sekundy));
			localStorage.setItem(
				"desetiny",
				JSON.stringify(this.state.desetiny)
			);
		}
	};*/
	updateTime = () => {
		let sek = this.state.sekundy;
		let min = this.state.minuty;

		if (min >= 12) {
			this.setState({ pauseTimer: true });
		}

		if (!this.state.pauseTimer) {
			if (sek >= 59) {
				min++;
				sek = 0;
			} else {
				sek++;
			}

			this.setState({ minuty: min, sekundy: sek }, function () {
				localStorage.setItem(
					"minuty",
					JSON.stringify(this.state.minuty)
				);
				localStorage.setItem(
					"sekundy",
					JSON.stringify(this.state.sekundy)
				);
				localStorage.setItem(
					"desetiny",
					JSON.stringify(this.state.desetiny)
				);
			});
		}
	};

	render() {
		return (
			<>
				<div id="casovac-cas-cont">
					<span
						className="casovac-cas"
						style={{
							fontSize: this.state.casFont + "vw",
							lineHeight: this.state.casFont * 0.8 + "vw",
						}}
						onContextMenu={(e) => {
							e.preventDefault();
							if (!this.state.nastaveno) {
								this.setState({
									casFont: this.state.casFont - 1,
								});
							}
						}}
						onClick={(e) => {
							e.preventDefault();
							if (!this.state.nastaveno) {
								this.setState({
									casFont: this.state.casFont + 1,
								});
							} else {
								this.setState({
									pauseTimer: !this.state.pauseTimer,
								});
							}
						}}
						id="left"
					>
						{this.state.minuty < 10
							? "0" + this.state.minuty
							: this.state.minuty}
					</span>
					<span
						className="casovac-cas"
						id="center"
						style={{
							fontSize: this.state.casFont + "vw",
							lineHeight: this.state.casFont * 0.8 + "vw",
							color: this.state.pauseTimer
								? "#e63946"
								: "#f1faee",
						}}
						onContextMenu={(e) => {
							e.preventDefault();
							if (!this.state.nastaveno) {
								this.setState({
									casFont: this.state.casFont - 1,
								});
							}
						}}
						onClick={(e) => {
							e.preventDefault();
							if (!this.state.nastaveno) {
								this.setState({
									casFont: this.state.casFont + 1,
								});
							} else {
								this.setState({
									pauseTimer: !this.state.pauseTimer,
								});
							}
						}}
					>
						:
					</span>
					<span
						className="casovac-cas"
						id="right"
						style={{
							fontSize: this.state.casFont + "vw",
							lineHeight: this.state.casFont * 0.8 + "vw",
						}}
						onContextMenu={(e) => {
							e.preventDefault();
							if (!this.state.nastaveno) {
								this.setState({
									casFont: this.state.casFont - 1,
								});
							}
						}}
						onClick={(e) => {
							e.preventDefault();
							if (!this.state.nastaveno) {
								this.setState({
									casFont: this.state.casFont + 1,
								});
							} else {
								this.setState({
									pauseTimer: !this.state.pauseTimer,
								});
							}
						}}
					>
						{this.state.sekundy < 10
							? "0" + this.state.sekundy
							: this.state.sekundy}
					</span>
					<span
						className="casovac-cas"
						style={{
							fontSize: this.state.casFont + "vw",
							lineHeight: this.state.casFont * 0.8 + "vw",
							visibility: "hidden",
						}}
					>
						_
					</span>
				</div>
				<div id="casovac-skore-flex">
					<div className="casovac-skore-flex-items">
						<div className="casovac-skore-jmeno">
							<span>Antišunkofleci</span>
						</div>
						<div className="casovac-skore-skore">
							<span
								style={{
									fontSize: this.state.scoreFont + "vw",
									lineHeight:
										this.state.scoreFont * 0.8 + "vw",
								}}
								onContextMenu={(e) => {
									e.preventDefault();
									if (
										this.state.nastaveno &&
										this.state.domaciSkore > 0
									) {
										this.setState({
											domaciSkore:
												this.state.domaciSkore - 1,
										});
									} else if (!this.state.nastaveno) {
										this.setState({
											scoreFont: this.state.scoreFont - 1,
										});
									}
								}}
								onClick={(e) => {
									e.preventDefault();
									if (this.state.nastaveno) {
										this.setState({
											domaciSkore:
												this.state.domaciSkore + 1,
										});
									} else {
										this.setState({
											scoreFont: this.state.scoreFont + 1,
										});
									}
								}}
							>
								{this.state.domaciSkore}
							</span>
						</div>
					</div>
					<div className="casovac-skore-flex-items">
						<div className="casovac-skore-jmeno">
							<span>Vygrachanci</span>
						</div>
						<div className="casovac-skore-skore">
							<span
								style={{
									fontSize: this.state.scoreFont + "vw",
									lineHeight:
										this.state.scoreFont * 0.8 + "vw",
								}}
								onContextMenu={(e) => {
									e.preventDefault();

									if (
										this.state.nastaveno &&
										this.state.hosteSkore > 0
									) {
										this.setState({
											hosteSkore:
												this.state.hosteSkore - 1,
										});
									} else if (!this.state.nastaveno) {
										this.setState({
											scoreFont: this.state.scoreFont - 1,
										});
									}
								}}
								onClick={(e) => {
									e.preventDefault();
									if (this.state.nastaveno) {
										this.setState({
											hosteSkore:
												this.state.hosteSkore + 1,
										});
									} else {
										this.setState({
											scoreFont: this.state.scoreFont + 1,
										});
									}
								}}
							>
								{this.state.hosteSkore}
							</span>
						</div>
					</div>
					<div id="casovac-tresty">
						<div>
							<h3>Tresty</h3>
						</div>
						<div>0:48</div>
						<div>4:58</div>
					</div>
					<div></div>
				</div>
				<button
					onClick={() => {
						this.setState({ nastaveno: true });

						localStorage.setItem(
							"casFont",
							JSON.stringify(this.state.casFont)
						);
						localStorage.setItem(
							"scoreFont",
							JSON.stringify(this.state.scoreFont)
						);
					}}
					style={{ display: this.state.nastaveno ? "none" : "block" }}
				>
					Nastaveno
				</button>
			</>
		);
	}
}

export default Casovac;
