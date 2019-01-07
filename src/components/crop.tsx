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
import { ImageRotate90DegreesCcw } from "material-ui/svg-icons";
const Editor = ImageEditor.default || ImageEditor;

@observer
export class CropImageModal extends React.Component<{
	src: string;
	onDismiss: () => void;
	onSave: (src: string) => void;
}> {
	@observable zoom: number = 5;
	@observable rotation: number = 1;
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
					<div className="grid-el" style={{ display: "block" }} />
					<Editor
						image={this.props.src}
						width={300}
						height={400}
						color={[0, 0, 0, 0.6]}
						scale={this.zoom}
						rotate={this.rotation}
						ref={ref => (this.editorRef = ref)}
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
									min={1}
									max={30}
									value={this.zoom}
									onChange={(e, v) => {
										this.zoom = v;
									}}
								/>
								<br />
								<FormControlLabel
									control={
										<Switch
											value={this.showGrid}
											onChange={(e, v) => {
												this.showGrid = v;
											}}
										/>
									}
									label="Uncontrolled"
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
									min={-359}
									max={359}
									value={this.rotation}
									onChange={(e, v) => {
										if (v) {
											this.rotation = v;
										}
									}}
								/>
								<br />
								<Grid container>
									<Grid item xs={6}>
										<IconButton
											onClick={() => {
												this.rotation =
													this.rotation - 90;
											}}
										>
											<RotateLeft />
										</IconButton>
									</Grid>
									<Grid item xs={6}>
										<IconButton
											onClick={() => {
												this.rotation =
													this.rotation + 90;
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
// TODO: add grid
// TODO: add full rotation buttons (90deg incs)