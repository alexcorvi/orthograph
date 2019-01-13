import * as React from "react";
import * as ReactDOM from "react-dom";
import { Cancel, Check, RotateLeft, RotateRight } from "@material-ui/icons";
import {
	Dialog,
	DialogTitle,
	Grid,
	IconButton,
	Typography,
	DialogActions,
	DialogContent,
	FormControlLabel,
	Switch,
	Divider,
	Button
} from "@material-ui/core";
import { Slider } from "@material-ui/lab";
import { observable, computed } from "mobx";
import { observer } from "mobx-react";
import * as ImageEditor from "react-avatar-editor";
const Editor = ImageEditor.default || ImageEditor;

@observer
export class CropImageModal extends React.Component<{
	src: string;
	prevSrc: string;
	onDismiss: () => void;
	onSave: (src: string) => void;
}> {
	@observable overlay: boolean = false;
	@observable zoom: number = 1;
	@observable baseRotation: number = 1;
	@observable addedRotation: number = 0;
	@observable showGrid: boolean = true;
	@observable editorRef: ImageEditor.default | null = null;

	render() {
		return (
			<Dialog
				open={!!this.props.src.length}
				onClose={() => {
					return;
				}}
				className="cropping-dialog"
			>
				<DialogContent style={{ padding: 0, position: "relative" }}>
					{this.showGrid ? <div className="grid-el" /> : ""}
					{this.overlay ? (
						<img
							src={this.props.prevSrc}
							style={{ position: "absolute", width: "100%" }}
						/>
					) : (
						""
					)}
					<Editor
						image={this.props.src}
						width={280}
						height={530}
						color={[0, 0, 0, 0.6]}
						scale={this.zoom}
						rotate={this.baseRotation + this.addedRotation}
						ref={ref => (this.editorRef = ref)}
						style={{ opacity: this.overlay ? 0.5 : 1 }}
					/>
				</DialogContent>
				<DialogActions style={{ overflow: "hidden" }}>
					<Grid container spacing={8}>
						<Grid item xs={6} style={{ padding: 0 }}>
							<div className="crop-controls">
								<Typography
									id="label"
									style={{ textAlign: "center" }}
								>
									Zoom
								</Typography>
								<br />
								<Slider
									min={0.3}
									max={5}
									value={this.zoom}
									onChange={(e, v) => {
										if (e && v) {
											this.zoom = v;
										}
									}}
								/>
								<br />
								<FormControlLabel
									control={
										<Switch
											checked={this.showGrid}
											onChange={(e, v) => {
												if (e) {
													this.showGrid = v;
												}
											}}
										/>
									}
									label="Grid"
								/>
								<FormControlLabel
									control={
										<Switch
											checked={this.overlay}
											onChange={(e, v) => {
												if (e) {
													this.overlay = v;
												}
											}}
										/>
									}
									label="Overlay"
								/>
							</div>
						</Grid>
						<Grid item xs={6} style={{ padding: 0 }}>
							<div className="crop-controls">
								<Typography
									id="label"
									style={{ textAlign: "center" }}
								>
									Rotation
								</Typography>
								<br />
								<Slider
									min={-45}
									max={45}
									value={this.addedRotation}
									onChange={(e, v) => {
										if (e && v) {
											this.addedRotation = v;
										}
									}}
								/>
								<br />
								<Grid container>
									<Grid item xs={6}>
										<IconButton
											onClick={() => {
												this.baseRotation =
													this.baseRotation - 90;
											}}
										>
											<RotateLeft />
										</IconButton>
									</Grid>
									<Grid item xs={6}>
										<IconButton
											onClick={() => {
												this.baseRotation =
													this.baseRotation + 90;
											}}
										>
											<RotateRight />
										</IconButton>
									</Grid>
								</Grid>
							</div>
						</Grid>
					</Grid>
				</DialogActions>
				<Divider />
				<div className="crop-bottom">
					<Button
						color="primary"
						onClick={() => {
							if (!this.editorRef) {
								return;
							}

							this.props.onSave(
								this.editorRef.getImage().toDataURL()
							);
							this.props.onDismiss();
						}}
					>
						<Check fontSize="small" style={{ marginRight: 5 }} />
						Add
					</Button>
					<Button
						color="secondary"
						onClick={() => this.props.onDismiss()}
					>
						<Cancel fontSize="small" style={{ marginRight: 5 }} />
						Dismiss
					</Button>
				</div>
			</Dialog>
		);
	}
}

// TODO: support touch event
