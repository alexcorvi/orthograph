import { computed, observable } from "mobx";
import { saveAs } from "file-saver";

export const colors = [
	"#FAFAFA",
	"#ffc107",
	"#90CAF9",
	"#cddc39",
	"#D1C4ED",
	"#FFAB91"
];

export const graphTypes = [
	"anterior",
	"right buccal",
	"left buccal",
	"occlusal upper",
	"occlusal lower",
	"facial",
	"smiling",
	"sideView",
	"cephalometric"
];

interface LineJSON {
	x1: number;
	x2: number;
	y1: number;
	y2: number;
	color: string;
}

interface GraphJSON {
	source: string;
	comment: string;
	lines: LineJSON[];
	refIndex: number;
}

interface VisitJSON {
	date: number;
	comment: string;
	graphs: GraphJSON[];
}

interface ListItemJSON {
	title: string;
	done: boolean;
}

interface AlbumJSON {
	_id: string;
	title: string;
	problemList: ListItemJSON[];
	patientComplaint: ListItemJSON[];
	treatmentPlan: ListItemJSON[];
	visits: VisitJSON[];
	nextNotes: ListItemJSON[];
}

export class Line {
	@observable x1: number = 0;
	@observable x2: number = 0;
	@observable y1: number = 0;
	@observable y2: number = 0;
	@observable color: string =
		colors[Math.floor(Math.random() * (5 - 0 + 1)) + 0];

	constructor(json?: LineJSON) {
		if (json) {
			this.x1 = json.x1;
			this.x2 = json.x2;
			this.y1 = json.y1;
			this.y2 = json.y2;
			this.color = json.color;
		}
	}

	toJSON(): LineJSON {
		return {
			x1: this.x1,
			x2: this.x2,
			y1: this.y1,
			y2: this.y2,
			color: this.color
		};
	}
}

export class Graph {
	@observable source: string = "";
	@observable comment: string = "";
	@observable lines: Line[] = [];
	@observable refIndex: number = 0;

	toJSON(): GraphJSON {
		return {
			source: this.source,
			comment: this.comment,
			lines: this.lines.map(line => line.toJSON()),
			refIndex: this.refIndex
		};
	}

	constructor(json?: GraphJSON) {
		if (json) {
			this.source = json.source;
			this.comment = json.comment;
			this.refIndex = json.refIndex;
			this.lines = json.lines.map(lineJSON => new Line(lineJSON));
		}
	}

	@computed
	get relationsToReference() {
		const r = this.lines[this.refIndex];
		if (!r) {
			return [];
		}
		const ref = Math.sqrt(
			(r.x2 - r.x1) * (r.x2 - r.x1) + (r.y2 - r.y1) * (r.y2 - r.y1)
		);
		return this.lines.map(
			l =>
				Math.round(
					(Math.sqrt(
						(l.x2 - l.x1) * (l.x2 - l.x1) +
							(l.y2 - l.y1) * (l.y2 - l.y1)
					) /
						ref) *
						100
				) / 100
		);
	}

	@computed
	get allPoints() {
		const points: { x: number; y: number; color: string }[] = [];
		this.lines.forEach(line => {
			points.push({ x: line.x1, y: line.y1, color: line.color });
			points.push({ x: line.x2, y: line.y2, color: line.color });
		});

		return points;
	}

	addLine(x: number, y: number) {
		if (
			this.lines[this.lines.length - 1] &&
			this.lines[this.lines.length - 1].x2 === 0 &&
			this.lines[this.lines.length - 1].y2 === 0
		) {
			// finishing line
			this.lines[this.lines.length - 1].x2 = x;
			this.lines[this.lines.length - 1].y2 = y;
		} else {
			// starting line
			const line = new Line();
			line.x1 = x;
			line.y1 = y;
			this.lines.push(line);
		}
	}
}

export class Visit {
	@observable date: Date = new Date();
	@observable comment: string = "";
	@observable graphs: Graph[] = graphTypes.map(() => new Graph());

	toJSON(): VisitJSON {
		return {
			date: this.date.getTime(),
			comment: this.comment,
			graphs: this.graphs.map(graph => graph.toJSON())
		};
	}

	constructor(json?: VisitJSON) {
		if (json) {
			this.date = new Date(json.date);
			this.comment = json.comment;
			this.graphs = json.graphs.map(graph => new Graph(graph));
		}
	}
}

export class ListItem {
	@observable title: string = "";
	@observable done: boolean = false;

	toJSON(): ListItemJSON {
		return {
			title: this.title,
			done: this.done
		};
	}

	constructor(json: ListItemJSON) {
		this.title = json.title;
		this.done = json.done;
	}
}

export class Album {
	@observable _id: string =
		Math.random()
			.toString(36)
			.replace(/[^a-z]/gi, "") +
		new Date()
			.getTime()
			.toString(36)
			.replace(/[^a-z]/gi, "");

	@observable title: string = "";
	@observable problemList: ListItem[] = [];
	@observable patientComplaint: ListItem[] = [];
	@observable nextNotes: ListItem[] = [];
	@observable treatmentPlan: ListItem[] = [];
	@observable visits: Visit[] = [];

	@computed get fileName() {
		return this._id + "__" + this.title;
	}

	toJSON(): AlbumJSON {
		return {
			title: this.title,
			problemList: this.problemList.map(p => p.toJSON()),
			patientComplaint: this.patientComplaint.map(c => c.toJSON()),
			treatmentPlan: this.treatmentPlan.map(t => t.toJSON()),
			visits: this.visits.map(v => v.toJSON()),
			_id: this._id,
			nextNotes: this.nextNotes
		};
	}

	toBlob(): Blob {
		const data = "orthograph:" + JSON.stringify(this.toJSON());
		const blob = new Blob([data], { type: "text/plain;charset=utf-8" });
		return blob;
	}

	constructor(json?: AlbumJSON) {
		if (json) {
			this.title = json.title;
			this.problemList = json.problemList.map(p => new ListItem(p));
			this.patientComplaint = json.patientComplaint.map(
				c => new ListItem(c)
			);
			this.treatmentPlan = json.treatmentPlan.map(t => new ListItem(t));
			this.visits = json.visits.map(v => new Visit(v));
			this._id = json._id;
			this.nextNotes = (json.nextNotes || []).map(i => new ListItem(i));
		}
	}
}
