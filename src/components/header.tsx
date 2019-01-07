import * as React from "react";
import * as ReactDOM from "react-dom";
import {
	AddBoxOutlined,
	Delete,
	RemoveRedEye,
	SaveAlt,
	Save
} from "@material-ui/icons";
import { Album, graphTypes, Step, viewControl } from "../data";
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
	Typography
} from "@material-ui/core";
import { observable } from "mobx";
import { observer } from "mobx-react";

@observer
export class AlbumHeader extends React.Component<{ album: Album }> {
	@observable problemToAdd: string = "";
	@observable planToAdd: string = "";

	@observable compliantToAdd: string = "";

	@observable openDrawer: boolean = false;

	addProblem() {
		if (!this.problemToAdd) {
			return;
		}
		this.props.album.problemList.push(
			new Step({ title: this.problemToAdd, done: false })
		);
		this.problemToAdd = "";
	}

	addPlan() {
		if (!this.planToAdd) {
			return;
		}
		this.props.album.treatmentPlan.push(
			new Step({ title: this.planToAdd, done: false })
		);
		this.planToAdd = "";
	}

	addCompliant() {
		if (!this.compliantToAdd) {
			return;
		}
		this.props.album.patientComplaint.push(
			new Step({ title: this.compliantToAdd, done: false })
		);
		this.compliantToAdd = "";
	}

	render() {
		return (
			<div>
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
								value={this.props.album.title}
								onChange={e => {
									this.props.album.title = e.target.value;
								}}
							/>
						</Typography>
						{viewControl.asInternalApplication ? (
							<IconButton
								color="inherit"
								onClick={() => {
									this.props.album.saveToPatient();
								}}
							>
								<Save />
							</IconButton>
						) : (
							<IconButton
								color="inherit"
								onClick={() => {
									this.props.album.save();
								}}
							>
								<SaveAlt />
							</IconButton>
						)}
					</Toolbar>
				</AppBar>
				<table
					style={{
						display: viewControl.showTopLists ? undefined : "none"
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
										{this.props.album.patientComplaint.map(
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
																(this.props.album.patientComplaint[
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
																(this.props.album.patientComplaint[
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
																	this.props.album.patientComplaint.splice(
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
										{this.props.album.problemList.map(
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
																(this.props.album.problemList[
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
																(this.props.album.problemList[
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
																	this.props.album.problemList.splice(
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
										{this.props.album.treatmentPlan.map(
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
																(this.props.album.treatmentPlan[
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
																(this.props.album.treatmentPlan[
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
																	this.props.album.treatmentPlan.splice(
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
								viewControl.showTopLists = !viewControl.showTopLists;
							}}
						>
							<Checkbox
								checked={viewControl.showTopLists}
								onChange={e => {
									viewControl.showTopLists = e.target.checked;
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
									viewControl.showGraphs[index] = !viewControl
										.showGraphs[index];
								}}
							>
								<Checkbox
									checked={viewControl.showGraphs[index]}
									onChange={e => {
										viewControl.showGraphs[index] =
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
								value={viewControl.thumbnailSize}
								fullWidth
								onChange={e => {
									const val = Number(e.target.value);
									if (isNaN(val)) {
										return;
									}
									viewControl.thumbnailSize = val;
									viewControl.updateLines();
								}}
							/>
						</ListItem>
					</List>
				</Drawer>
			</div>
		);
	}
}
