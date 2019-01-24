import * as React from "react";
import * as ReactDOM from "react-dom";
import {
	AddBoxOutlined,
	Delete,
	RemoveRedEye,
	SaveAlt,
	Save,
	Close
} from "@material-ui/icons";
import {
	Album,
	graphTypes,
	ListItem as DataListItem
} from "../data/album-data";
import {
	AppBar,
	Button,
	Checkbox,
	Divider,
	Drawer,
	IconButton,
	InputBase,
	List,
	ListItem,
	ListItemSecondaryAction,
	ListItemText,
	Paper,
	TextField,
	Toolbar,
	Typography,
	Grid
} from "@material-ui/core";
import { observable } from "mobx";
import { observer } from "mobx-react";
import { albumView } from "../data/album-view-data";
import { main } from "../data/main";

@observer
export class AlbumHeader extends React.Component {
	@observable problemToAdd: string = "";
	@observable planToAdd: string = "";

	@observable compliantToAdd: string = "";

	@observable noteToAdd: string = "";

	@observable openDrawer: boolean = false;

	addProblem() {
		if (!this.problemToAdd) {
			return;
		}
		main.currentlyOpenAlbum.problemList.push(
			new DataListItem({ title: this.problemToAdd, done: false })
		);
		this.problemToAdd = "";
	}

	addPlan() {
		if (!this.planToAdd) {
			return;
		}
		main.currentlyOpenAlbum.treatmentPlan.push(
			new DataListItem({ title: this.planToAdd, done: false })
		);
		this.planToAdd = "";
	}

	addCompliant() {
		if (!this.compliantToAdd) {
			return;
		}
		main.currentlyOpenAlbum.patientComplaint.push(
			new DataListItem({ title: this.compliantToAdd, done: false })
		);
		this.compliantToAdd = "";
	}

	addNote() {
		if (!this.noteToAdd) {
			return;
		}
		main.currentlyOpenAlbum.nextNotes.push(
			new DataListItem({ title: this.noteToAdd, done: false })
		);
		this.noteToAdd = "";
	}

	render() {
		return (
			<div style={{ width: "100%", overflowX: "auto" }}>
				<AppBar position="fixed">
					<Toolbar>
						<IconButton
							color="inherit"
							aria-label="Menu"
							style={{ marginLeft: -12, marginRight: 20 }}
							onClick={() => (this.openDrawer = true)}
						>
							<RemoveRedEye />
						</IconButton>
						<Typography
							variant="h6"
							color="inherit"
							style={{ flexGrow: 1 }}
						>
							<InputBase
								className="album-title"
								value={main.currentlyOpenAlbum.title}
								onChange={e => {
									main.currentlyOpenAlbum.title =
										e.target.value;
								}}
							/>
						</Typography>
						<IconButton
							color="inherit"
							onClick={async () => {
								await main.svAlbum(main.currentlyOpenAlbum);
								await main.listAlbums();
							}}
						>
							<Save />
						</IconButton>
						<IconButton
							color="inherit"
							onClick={() => {
								main.openedAlbum = false;
								main.setHash(main.accessToken, "");
								main.listAlbums();
							}}
						>
							<Close />
						</IconButton>
					</Toolbar>
				</AppBar>
				<table
					style={{
						display: albumView.showTopLists ? undefined : "none"
					}}
					className="top-lists"
				>
					<tbody>
						<tr>
							<td>
								<Paper style={{ padding: 15, marginTop: 7 }}>
									<Typography variant="overline" gutterBottom>
										Patient complaint
									</Typography>
									<Divider />
									<IconButton
										style={{
											marginRight: 10,
											marginBottom: 5,
											padding: 0
										}}
										onClick={() => {
											this.addCompliant();
										}}
									>
										<AddBoxOutlined />
									</IconButton>
									<InputBase
										placeholder="Add problem"
										onChange={e => {
											this.compliantToAdd =
												e.target.value;
										}}
										onKeyPress={e => {
											if (e.which === 13) {
												this.addCompliant();
											}
										}}
										value={this.compliantToAdd}
									/>

									<Divider />
									<List>
										{main.currentlyOpenAlbum.patientComplaint.map(
											(compliant, index) => {
												return (
													<ListItem
														key={index}
														button
														style={{
															padding: 0
														}}
													>
														<Checkbox
															tabIndex={-1}
															disableRipple
															style={{
																padding: 0
															}}
															onChange={e =>
																(main.currentlyOpenAlbum.patientComplaint[
																	index
																].done = e
																	.target
																	.checked
																	? true
																	: false)
															}
															checked={
																compliant.done
															}
														/>
														<InputBase
															value={
																compliant.title
															}
															onChange={e =>
																(main.currentlyOpenAlbum.patientComplaint[
																	index
																].title =
																	e.target.value)
															}
														/>
														<ListItemSecondaryAction>
															<IconButton
																style={{
																	padding: 0
																}}
																onClick={() =>
																	main.currentlyOpenAlbum.patientComplaint.splice(
																		index,
																		1
																	)
																}
															>
																<Delete />
															</IconButton>
														</ListItemSecondaryAction>
													</ListItem>
												);
											}
										)}
									</List>
								</Paper>
							</td>
							<td>
								<Paper style={{ padding: 15, marginTop: 7 }}>
									<Typography variant="overline" gutterBottom>
										Problem List
									</Typography>
									<Divider />
									<IconButton
										style={{
											marginRight: 10,
											marginBottom: 5,
											padding: 0
										}}
										onClick={() => {
											this.addProblem();
										}}
									>
										<AddBoxOutlined />
									</IconButton>
									<InputBase
										placeholder="Add problem"
										onChange={e => {
											this.problemToAdd = e.target.value;
										}}
										onKeyPress={e => {
											if (e.which === 13) {
												this.addProblem();
											}
										}}
										value={this.problemToAdd}
									/>

									<Divider />
									<List>
										{main.currentlyOpenAlbum.problemList.map(
											(problem, index) => {
												return (
													<ListItem
														key={index}
														button
														style={{
															padding: 0
														}}
													>
														<Checkbox
															tabIndex={-1}
															disableRipple
															style={{
																padding: 0
															}}
															onChange={e =>
																(main.currentlyOpenAlbum.problemList[
																	index
																].done = e
																	.target
																	.checked
																	? true
																	: false)
															}
															checked={
																problem.done
															}
														/>
														<InputBase
															value={
																problem.title
															}
															onChange={e =>
																(main.currentlyOpenAlbum.problemList[
																	index
																].title =
																	e.target.value)
															}
														/>
														<ListItemSecondaryAction>
															<IconButton
																style={{
																	padding: 0
																}}
																onClick={() =>
																	main.currentlyOpenAlbum.problemList.splice(
																		index,
																		1
																	)
																}
															>
																<Delete />
															</IconButton>
														</ListItemSecondaryAction>
													</ListItem>
												);
											}
										)}
									</List>
								</Paper>
							</td>
							<td>
								<Paper style={{ padding: 15, marginTop: 7 }}>
									<Typography variant="overline" gutterBottom>
										Treatment Plan
									</Typography>
									<Divider />
									<IconButton
										style={{
											marginRight: 10,
											marginBottom: 5,
											padding: 0
										}}
										onClick={() => {
											this.addPlan();
										}}
									>
										<AddBoxOutlined />
									</IconButton>
									<InputBase
										placeholder="Add plan"
										onChange={e => {
											this.planToAdd = e.target.value;
										}}
										onKeyPress={e => {
											if (e.which === 13) {
												this.addPlan();
											}
										}}
										value={this.planToAdd}
									/>

									<Divider />
									<List>
										{main.currentlyOpenAlbum.treatmentPlan.map(
											(plan, index) => {
												return (
													<ListItem
														key={index}
														button
														style={{
															padding: 0
														}}
													>
														<Checkbox
															tabIndex={-1}
															disableRipple
															style={{
																padding: 0
															}}
															onChange={e =>
																(main.currentlyOpenAlbum.treatmentPlan[
																	index
																].done = e
																	.target
																	.checked
																	? true
																	: false)
															}
															checked={plan.done}
														/>
														<InputBase
															value={plan.title}
															onChange={e =>
																(main.currentlyOpenAlbum.treatmentPlan[
																	index
																].title =
																	e.target.value)
															}
														/>
														<ListItemSecondaryAction>
															<IconButton
																style={{
																	padding: 0
																}}
																onClick={() =>
																	main.currentlyOpenAlbum.treatmentPlan.splice(
																		index,
																		1
																	)
																}
															>
																<Delete />
															</IconButton>
														</ListItemSecondaryAction>
													</ListItem>
												);
											}
										)}
									</List>
								</Paper>
							</td>
							<td>
								<Paper style={{ padding: 15, marginTop: 7 }}>
									<Typography variant="overline" gutterBottom>
										Notes for next visit
									</Typography>
									<Divider />
									<IconButton
										style={{
											marginRight: 10,
											marginBottom: 5,
											padding: 0
										}}
										onClick={() => {
											this.addNote();
										}}
									>
										<AddBoxOutlined />
									</IconButton>
									<InputBase
										placeholder="Add note"
										onChange={e => {
											this.noteToAdd = e.target.value;
										}}
										onKeyPress={e => {
											if (e.which === 13) {
												this.addNote();
											}
										}}
										value={this.noteToAdd}
									/>

									<Divider />
									<List>
										{main.currentlyOpenAlbum.nextNotes.map(
											(note, index) => {
												return (
													<ListItem
														key={index}
														button
														style={{
															padding: 0
														}}
													>
														<Checkbox
															tabIndex={-1}
															disableRipple
															style={{
																padding: 0
															}}
															onChange={e =>
																(main.currentlyOpenAlbum.nextNotes[
																	index
																].done = e
																	.target
																	.checked
																	? true
																	: false)
															}
															checked={note.done}
														/>
														<InputBase
															value={note.title}
															onChange={e =>
																(main.currentlyOpenAlbum.nextNotes[
																	index
																].title =
																	e.target.value)
															}
														/>
														<ListItemSecondaryAction>
															<IconButton
																style={{
																	padding: 0
																}}
																onClick={() =>
																	main.currentlyOpenAlbum.nextNotes.splice(
																		index,
																		1
																	)
																}
															>
																<Delete />
															</IconButton>
														</ListItemSecondaryAction>
													</ListItem>
												);
											}
										)}
									</List>
								</Paper>
							</td>
						</tr>
					</tbody>
				</table>
				<Drawer
					open={this.openDrawer}
					onClose={() => (this.openDrawer = false)}
				>
					<List style={{ minWidth: 300 }}>
						<ListItem
							dense
							button
							onClick={() => {
								albumView.showTopLists = !albumView.showTopLists;
							}}
						>
							<Checkbox
								checked={albumView.showTopLists}
								onChange={e => {
									albumView.showTopLists = e.target.checked;
								}}
								tabIndex={-1}
								disableRipple
								color="primary"
							/>
							<ListItemText primary={`Show top lists`} />
						</ListItem>
						<Divider />
						{graphTypes.map((value, index) => (
							<ListItem
								key={value}
								dense
								button
								onClick={() => {
									albumView.showGraphs[index] = !albumView
										.showGraphs[index];
								}}
							>
								<Checkbox
									checked={albumView.showGraphs[index]}
									onChange={e => {
										albumView.showGraphs[index] =
											e.target.checked;
									}}
									tabIndex={-1}
									disableRipple
									color="primary"
								/>
								<ListItemText
									primary={`Show ${graphTypes[index]}`}
								/>
							</ListItem>
						))}
						<Divider />
						<br />
						<ListItem>
							<TextField
								label="thumbnail size"
								variant="outlined"
								type="number"
								value={albumView.thumbnailSize}
								fullWidth
								onChange={e => {
									const val = Number(e.target.value);
									if (isNaN(val)) {
										return;
									}
									albumView.thumbnailSize = val;
									albumView.updateLines();
								}}
							/>
						</ListItem>
					</List>
				</Drawer>
			</div>
		);
	}
}
