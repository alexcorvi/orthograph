import * as data from "../data/album-data";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { AlbumView } from "./album";
import { computed, observable } from "mobx";
import { observer } from "mobx-react";
import { Start } from "./start";
import { main } from "../data/main";
import { Typography } from "@material-ui/core";

@observer
export class Main extends React.Component<{}> {
	@observable album: data.Album | undefined = undefined;

	render() {
		return (
			<main className="main">
				{main.openedAlbum ? <AlbumView /> : <Start />}
				{main.loading ? (
					<div className="loader-container">
						<div className="loader" />
						<Typography
							variant="overline"
							style={{ textAlign: "center" }}
						>
							{main.loadedMBytes}MB / {main.totalMBytes}MB
						</Typography>
						<div className="bar-loader">
							<div className="back" style={{ width: "100%" }} />
							<div
								className="top"
								style={{
									width: `${(main.loadedMBytes /
										main.totalMBytes) *
										100}%`
								}}
							/>
						</div>
					</div>
				) : (
					""
				)}
			</main>
		);
	}
}
