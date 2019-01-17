import * as React from "react";
import * as ReactDOM from "react-dom";
import {
	AddCircleOutline,
	Close,
	DeleteForever,
	FiberManualRecordRounded,
	Flag,
	PlaylistAdd,
	RemoveCircle,
	Layers
} from "@material-ui/icons";
import { AddImage } from "./add-image";
import { Album, colors, Graph, graphTypes, Visit } from "../data/album-data";
import { AlbumHeader } from "./album-header";
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Fab,
	Grid,
	IconButton,
	List,
	ListItem,
	ListItemSecondaryAction,
	ListItemText,
	Paper,
	TextField,
	Typography
} from "@material-ui/core";
import { computed, observable } from "mobx";
import { CropImageModal } from "./crop";
import { observer } from "mobx-react";
import { albumView } from "../data/album-view-data";
import { main } from "../data/main";

@observer
export class AlbumContents extends React.Component {
	@observable toCropSrc: string = "";
	@observable toCropVisitIndex: number = 0;
	@observable toCropTypeIndex: number = 0;

	@observable toShowVisitIndex: number = -1;
	@observable toShowTypeIndex: number = -1;

	@observable addingLine: boolean = false;
	@observable removingLine: boolean = false;
	@observable overlay: boolean = false;

	@computed
	get toShowVisit() {
		return main.currentlyOpenAlbum.visits[this.toShowVisitIndex];
	}

	@computed
	get toShowGraph() {
		if (!this.toShowVisit) {
			return undefined;
		} else {
			return this.toShowVisit.graphs[this.toShowTypeIndex];
		}
	}

	@computed
	get toShowPrevGraph() {
		if (!this.toShowVisit) {
			return undefined;
		}
		const prevVisit =
			main.currentlyOpenAlbum.visits[this.toShowVisitIndex - 1];
		if (!prevVisit) {
			return undefined;
		} else {
			return prevVisit.graphs[this.toShowTypeIndex];
		}
	}

	@computed get toCropPreviousSource() {
		const prevVisit =
			main.currentlyOpenAlbum.visits[this.toCropVisitIndex - 1];
		if (!prevVisit) {
			return undefined;
		}
		const graph = prevVisit.graphs[this.toCropTypeIndex];
		if (!graph) {
			return undefined;
		}
		return graph.source;
	}

	render() {
		return (
			<div
				className="album-content-container"
				style={{ position: "relative" }}
			>
				<div style={{ overflowX: "auto" }}>
					<table className="album-content">
						<thead>
							<tr>
								<th />
								{graphTypes.map((type, i) => (
									<th
										key={type}
										style={{
											display: albumView.showGraphs[i]
												? undefined
												: "none"
										}}
									>
										<Typography
											style={{ color: "#fafafa" }}
											variant="overline"
										>
											{type}
										</Typography>
									</th>
								))}
							</tr>
						</thead>
						<tbody>
							{main.currentlyOpenAlbum.visits.map(
								(visit, visitIndex) => {
									return (
										<tr key={visitIndex}>
											<td>
												<Paper style={{ padding: 15 }}>
													<Typography
														variant="overline"
														gutterBottom
													>
														<TextField
															label="Record #"
															style={{
																width: 100
															}}
															type="number"
															variant="outlined"
															margin="dense"
															value={
																visitIndex + 1
															}
															onChange={e => {
																const val =
																	Number(
																		e.target
																			.value
																	) - 1;
																if (
																	isNaN(val)
																) {
																	return;
																}
																main.currentlyOpenAlbum.visits.splice(
																	val,
																	0,
																	main.currentlyOpenAlbum.visits.splice(
																		visitIndex,
																		1
																	)[0]
																);
															}}
														/>
														<Button
															color="secondary"
															onClick={() => {
																main.currentlyOpenAlbum.visits.splice(
																	visitIndex,
																	1
																);
															}}
															style={{
																float: "right"
															}}
														>
															<DeleteForever
																fontSize="small"
																style={{
																	marginRight: 5
																}}
															/>
															Delete
														</Button>
														{
															<TextField
																fullWidth
																variant="outlined"
																label="Date"
																type="date"
																margin="dense"
																value={
																	visit.date
																		.toISOString()
																		.split(
																			"T"
																		)[0]
																}
																onChange={v => {
																	if (
																		v.target
																			.value
																	) {
																		main.currentlyOpenAlbum.visits[
																			visitIndex
																		].date = new Date(
																			v.target.value
																		);
																	}
																}}
															/>
														}
													</Typography>
													<TextField
														fullWidth
														variant="outlined"
														margin="dense"
														label="Comment"
														value={visit.comment}
														multiline
														onChange={e =>
															(main.currentlyOpenAlbum.visits[
																visitIndex
															].comment =
																e.target.value)
														}
													/>
													<br />
												</Paper>
											</td>
											{graphTypes.map(
												(type, typeIndex) => (
													<td
														key={type}
														style={{
															display: albumView
																.showGraphs[
																typeIndex
															]
																? undefined
																: "none"
														}}
													>
														{visit.graphs[typeIndex]
															.source ? (
															<div
																style={{
																	width:
																		albumView.thumbnailSize,
																	cursor:
																		"pointer"
																}}
																onClick={() => {
																	this.toShowVisitIndex = visitIndex;
																	this.toShowTypeIndex = typeIndex;
																}}
															>
																<GraphViewer
																	graph={
																		visit
																			.graphs[
																			typeIndex
																		]
																	}
																	width={
																		"100%"
																	}
																/>
															</div>
														) : (
															<AddImage
																title={type}
																onSelect={src => {
																	this.toCropSrc = src;
																	this.toCropVisitIndex = visitIndex;
																	this.toCropTypeIndex = typeIndex;
																}}
															/>
														)}
													</td>
												)
											)}
										</tr>
									);
								}
							)}
						</tbody>
					</table>
					{this.toCropSrc ? (
						<CropImageModal
							src={this.toCropSrc}
							prevSrc={this.toCropPreviousSource || ""}
							onDismiss={() => {
								this.toCropSrc = "";
							}}
							onSave={croppedSrc => {
								main.currentlyOpenAlbum.visits[
									this.toCropVisitIndex
								].graphs[
									this.toCropTypeIndex
								].source = croppedSrc;
							}}
						/>
					) : (
						""
					)}
					{this.toShowGraph ? (
						<Dialog
							open={!!this.toShowGraph}
							onClose={() => {}}
							maxWidth="lg"
							fullWidth
						>
							<DialogTitle>
								<Typography variant="overline">
									Record #{this.toShowVisitIndex + 1} -{" "}
									{this.toShowVisit.date.toDateString()}
								</Typography>
								<Typography variant="overline">
									{graphTypes[this.toShowTypeIndex]} View
								</Typography>
								<Button
									color="primary"
									className="dismiss-dialog"
									onClick={() => {
										this.toShowVisitIndex = -1;
										this.toShowTypeIndex = -1;
									}}
								>
									<Close
										fontSize="small"
										style={{ marginRight: 5 }}
									/>
									Dismiss
								</Button>
							</DialogTitle>
							<DialogContent>
								<Grid container>
									<Grid
										item
										xs={8}
										style={{ position: "relative" }}
									>
										<div className="graph-buttons">
											<IconButton
												color={
													this.addingLine
														? "secondary"
														: "default"
												}
												onClick={() => {
													this.addingLine = !this
														.addingLine;
													this.removingLine = false;
												}}
											>
												<AddCircleOutline />
											</IconButton>
											<IconButton
												color={
													this.removingLine
														? "secondary"
														: "default"
												}
												onClick={() => {
													this.removingLine = !this
														.removingLine;
													this.addingLine = false;
												}}
											>
												<RemoveCircle />
											</IconButton>
											<IconButton
												color={
													this.overlay
														? "secondary"
														: "default"
												}
												onClick={() => {
													this.overlay = !this
														.overlay;
												}}
											>
												<Layers />
											</IconButton>
										</div>
										{this.toShowPrevGraph &&
										this.overlay ? (
											<GraphViewer
												graph={this.toShowPrevGraph}
												width="100%"
												className="overlay-bottom"
											/>
										) : (
											""
										)}
										<GraphViewer
											className={
												this.overlay
													? "overlay-top"
													: ""
											}
											graph={this.toShowGraph}
											width={"100%"}
											onClick={(x, y) => {
												if (this.addingLine) {
													main.currentlyOpenAlbum.visits[
														this.toShowVisitIndex
													].graphs[
														this.toShowTypeIndex
													].addLine(x, y);
												}
											}}
											onClickLine={index => {
												if (!this.removingLine) {
													return;
												}

												main.currentlyOpenAlbum.visits[
													this.toShowVisitIndex
												].graphs[
													this.toShowTypeIndex
												].lines.splice(index, 1);
											}}
										/>
									</Grid>
									<Grid
										item
										xs={4}
										style={{ padding: "0 10px 0 10px" }}
									>
										{this.toShowGraph.lines.length ? (
											<List
												className="lines-list"
												style={{
													paddingTop: 0,
													paddingBottom: 0
												}}
											>
												{this.toShowGraph.lines.map(
													(line, index) => {
														if (!this.toShowGraph) {
															return;
														}
														const relation = this
															.toShowGraph
															.relationsToReference[
															index
														];
														return (
															<ListItem
																key={index}
																dense
																style={{
																	background:
																		line.color
																}}
															>
																<ListItemText
																	primary={`${
																		index ===
																		this
																			.toShowGraph
																			.refIndex
																			? ""
																			: relation
																	}R`}
																/>
																<ListItemSecondaryAction>
																	{colors.map(
																		color => (
																			<IconButton
																				style={{
																					padding: 0
																				}}
																				onClick={() => {
																					main.currentlyOpenAlbum.visits[
																						this.toShowVisitIndex
																					].graphs[
																						this.toShowTypeIndex
																					].lines[
																						index
																					].color = color;
																				}}
																			>
																				<FiberManualRecordRounded
																					style={{
																						color,
																						fontSize: 12
																					}}
																				/>
																			</IconButton>
																		)
																	)}
																	<IconButton
																		onClick={() => {
																			main.currentlyOpenAlbum.visits[
																				this.toShowVisitIndex
																			].graphs[
																				this.toShowTypeIndex
																			].refIndex = index;
																		}}
																		style={{
																			padding: 0
																		}}
																	>
																		<Flag />
																	</IconButton>
																	<IconButton
																		style={{
																			padding: 0
																		}}
																		onClick={() => {
																			main.currentlyOpenAlbum.visits[
																				this
																					.toShowVisitIndex
																			].graphs[
																				this
																					.toShowTypeIndex
																			].lines.splice(
																				index,
																				1
																			);
																		}}
																	>
																		<DeleteForever />
																	</IconButton>
																</ListItemSecondaryAction>
															</ListItem>
														);
													}
												)}
											</List>
										) : (
											""
										)}

										<br />
										<TextField
											fullWidth
											variant="outlined"
											margin="dense"
											label="Comment"
											value={this.toShowGraph.comment}
											multiline
											onChange={e =>
												(main.currentlyOpenAlbum.visits[
													this.toShowVisitIndex
												].graphs[
													this.toShowTypeIndex
												].comment = e.target.value)
											}
										/>
									</Grid>
								</Grid>
							</DialogContent>
							<DialogActions>
								<Button
									color="secondary"
									onClick={() => {
										main.currentlyOpenAlbum.visits[
											this.toShowVisitIndex
										].graphs[this.toShowTypeIndex].source =
											"";
										main.currentlyOpenAlbum.visits[
											this.toShowVisitIndex
										].graphs[
											this.toShowTypeIndex
										].refIndex = 0;
										main.currentlyOpenAlbum.visits[
											this.toShowVisitIndex
										].graphs[
											this.toShowTypeIndex
										].lines = [];
										main.currentlyOpenAlbum.visits[
											this.toShowVisitIndex
										].graphs[this.toShowTypeIndex].comment =
											"";
										this.toShowVisitIndex = -1;
										this.toShowTypeIndex = -1;
									}}
								>
									<DeleteForever
										fontSize="small"
										style={{ marginRight: 5 }}
									/>
									Delete Graph
								</Button>
							</DialogActions>
						</Dialog>
					) : (
						""
					)}
				</div>
				<Fab
					color="primary"
					className="add-visit-fab"
					onClick={() => {
						main.currentlyOpenAlbum.visits.push(new Visit());
					}}
				>
					<PlaylistAdd />
				</Fab>
			</div>
		);
	}

	getPrevGraph(album: Album, visitIndex: number, typeIndex: number) {
		const prevVisit = album.visits[visitIndex - 1];
		if (!prevVisit) {
			return undefined;
		}
		return prevVisit.graphs[typeIndex];
	}
}

@observer
export class GraphViewer extends React.Component<{
	graph: Graph;
	width: string | number;
	onClick?: (x: number, y: number) => void;
	onClickLine?: (lineIndex: number) => void;
	className?: string;
}> {
	@observable id: string = `id-${Math.round(Math.random() * 1000)}`;

	@computed
	get rect() {
		const div = document.getElementById(this.id);
		if (!div) {
			return;
		}
		return div.getBoundingClientRect();
	}

	@computed
	get lines() {
		const calcs: {
			c: { width: number; left: number; top: number; angle: number };
			color: string;
		}[] = [];

		this.props.graph.lines.forEach(l => {
			if (l.x1 && l.x2 && l.y1 && l.y2) {
				calcs.push({
					c: this.calculateLine(l.x1, l.y1, l.x2, l.y2),
					color: l.color
				});
			}
		});

		return calcs;
	}

	calculateLine(x1: number, y1: number, x2: number, y2: number) {
		if (!this.rect) {
			return { width: 0, left: 0, top: 0, angle: 0 };
		}
		const x1P = (x1 / 100) * this.rect.width + 2.5;
		const x2P = (x2 / 100) * this.rect.width + 2.5;
		const y1P = (y1 / 100) * this.rect.height + 2.5;
		const y2P = (y2 / 100) * this.rect.height + 2.5;

		const width = Math.sqrt(
			(x2P - x1P) * (x2P - x1P) + (y2P - y1P) * (y2P - y1P)
		);
		const left = (x1P + x2P) / 2 - width / 2;
		const top = (y1P + y2P) / 2 - 1 / 2;
		let angle = Math.atan2(y1P - y2P, x1P - x2P) * (180 / Math.PI);

		if (Math.abs(angle) > 90) {
			if (angle > 0) {
				angle = (180 - angle) * -1;
			} else if (angle < 0) {
				angle = 180 - Math.abs(angle);
			}
		}

		return { width, left, top, angle };
	}
	render() {
		return (
			<div
				id={this.id}
				className={`graph-viewer ${
					this.props.className ? this.props.className : ""
				}`}
				style={{ width: this.props.width }}
				onClick={e => {
					if (!this.rect || !this.props.onClick) {
						return;
					}
					const floorX = this.rect.left;
					const floorY = this.rect.top;
					const XPixels = e.clientX - floorX;
					const YPixels = e.clientY - floorY;
					const XPercent = (XPixels / this.rect.width) * 100;
					const YPercent = (YPixels / this.rect.height) * 100;
					this.props.onClick(XPercent, YPercent);
				}}
			>
				<img src={this.props.graph.source} style={{ width: "100%" }} />
				<div className="points">
					{this.props.graph.allPoints.map((point, index) => {
						if (point.x === 0 && point.y === 0) {
							return "";
						}
						return (
							<div
								key={index}
								className="point"
								style={{
									background: point.color,
									top: `${point.y}%`,
									left: `${point.x}%`
								}}
							/>
						);
					})}
				</div>
				{albumView.mountPoints ? (
					<div className="lines">
						{this.lines.map((line, index) => {
							return (
								<div
									key={index}
									className="line"
									style={{
										background: line.color,
										color: line.color,
										width: line.c.width,
										left: line.c.left,
										top: line.c.top,
										transform: `rotate(${line.c.angle}deg)`
									}}
									onClick={() => {
										if (this.props.onClickLine) {
											this.props.onClickLine(index);
										}
									}}
								>
									{this.props.graph.refIndex === index
										? ""
										: this.props.graph.relationsToReference[
												index
										  ]}
									R
								</div>
							);
						})}
					</div>
				) : (
					""
				)}
			</div>
		);
	}

	componentDidMount() {
		albumView.updateLines();
	}
}

@observer
export class AlbumView extends React.Component {
	render() {
		return (
			<div className="album">
				<AlbumHeader />
				<AlbumContents />
			</div>
		);
	}
}
