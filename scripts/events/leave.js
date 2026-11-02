const { getTime } = global.utils;
const { createCanvas } = require("canvas");

const insults = [
	"Encore un abruti qui s'en va... Enfin la paix, espèce de parasite.",
	"Un idiot de moins. Notre groupe respire déjà mieux.",
	"Même ton ombre ne voulait plus rester avec toi.",
	"Ton départ est ta meilleure contribution au groupe.",
	"Bon débarras, pauvre clown. La sortie est par là.",
	"Un problème en moins, quelle magnifique journée.",
	"Tu vas nous manquer... Non, finalement pas du tout.",
	"Le groupe vient de gagner quelques points de QI.",
	"Adieu, espèce de catastrophe ambulante.",
	"Tu pars ? Même le silence va être plus intéressant.",
	"On aurait préféré que tu partes plus tôt.",
	"Une présence inutile de moins dans nos rangs.",
	"Félicitations, tu viens de réussir quelque chose.",
	"Les portes sont ouvertes, les regrets sont interdits.",
	"Enfin quelqu'un qui prend une bonne décision."
];

const kickInsults = [
	"Expulsé. Même la patience a ses limites.",
	"Dehors, parasite. Ici, on respire.",
	"Tu as été renvoyé à ta place : dehors.",
	"Le système a détecté un élément inutile.",
	"Fin de ton séjour. Aucun regret enregistré.",
	"Tu as été supprimé de nos rangs. Définitivement.",
	"Un clown expulsé, le spectacle continue.",
	"Tu n'étais déjà pas à ta place ici."
];

function roundedRect(ctx, x, y, width, height, radius) {
	ctx.beginPath();
	ctx.roundRect(x, y, width, height, radius);
}

function drawCard({ userName, threadName, time, session, type, insult }) {
	const canvas = createCanvas(1200, 700);
	const ctx = canvas.getContext("2d");

	// Background
	const bg = ctx.createLinearGradient(0, 0, 1200, 700);
	bg.addColorStop(0, "#080808");
	bg.addColorStop(0.5, "#190307");
	bg.addColorStop(1, "#050505");

	ctx.fillStyle = bg;
	ctx.fillRect(0, 0, 1200, 700);

	// Red atmospheric glow
	const glow = ctx.createRadialGradient(180, 150, 10, 180, 150, 500);
	glow.addColorStop(0, "rgba(190, 0, 35, 0.35)");
	glow.addColorStop(1, "rgba(0, 0, 0, 0)");

	ctx.fillStyle = glow;
	ctx.fillRect(0, 0, 1200, 700);

	// Decorative borders
	ctx.strokeStyle = "#8d1028";
	ctx.lineWidth = 3;
	ctx.strokeRect(20, 20, 1160, 660);

	ctx.strokeStyle = "rgba(180, 20, 50, 0.4)";
	ctx.lineWidth = 1;
	ctx.strokeRect(32, 32, 1136, 636);

	// Decorative circles
	for (let i = 0; i < 35; i++) {
		const x = Math.random() * 1200;
		const y = Math.random() * 700;

		ctx.beginPath();
		ctx.arc(x, y, Math.random() * 2 + 1, 0, Math.PI * 2);
		ctx.fillStyle = "rgba(255, 30, 60, 0.35)";
		ctx.fill();
	}

	// Header
	ctx.textAlign = "center";
	ctx.fillStyle = "#a50d2c";
	ctx.font = "bold 25px sans-serif";
	ctx.fillText("✦  D A R K   N E T W O R K  ✦", 600, 75);

	ctx.fillStyle = "#ffffff";
	ctx.font = "bold 62px sans-serif";
	ctx.fillText("DÉPART DU GROUPE", 600, 155);

	ctx.fillStyle = "#c00030";
	ctx.fillRect(380, 180, 440, 4);

	// Member name
	ctx.fillStyle = "#e5e5e5";
	ctx.font = "bold 27px sans-serif";
	ctx.fillText("MEMBRE", 600, 235);

	ctx.fillStyle = "#ed173d";
	ctx.font = "bold 43px sans-serif";
	ctx.fillText(userName, 600, 290, 1000);

	// Information panel
	roundedRect(ctx, 100, 335, 1000, 145, 18);
	ctx.fillStyle = "rgba(25, 5, 10, 0.9)";
	ctx.fill();

	ctx.strokeStyle = "#741025";
	ctx.lineWidth = 2;
	ctx.stroke();

	ctx.textAlign = "left";
	ctx.font = "bold 23px sans-serif";

	ctx.fillStyle = "#bdbdbd";
	ctx.fillText("ACTION", 145, 380);
	ctx.fillText("GROUPE", 145, 430);

	ctx.fillStyle = "#ed1740";
	ctx.font = "bold 23px sans-serif";
	ctx.fillText(type, 340, 380, 700);
	ctx.fillText(threadName, 340, 430, 700);

	// Time
	ctx.textAlign = "center";
	ctx.fillStyle = "#d8d8d8";
	ctx.font = "21px sans-serif";
	ctx.fillText(`HEURE : ${time}  |  ${session}`, 600, 520, 1000);

	// Random insult
	roundedRect(ctx, 90, 550, 1020, 90, 15);
	ctx.fillStyle = "rgba(100, 0, 25, 0.25)";
	ctx.fill();

	ctx.strokeStyle = "#a20c2d";
	ctx.stroke();

	ctx.fillStyle = "#ff3155";
	ctx.font = "bold 22px sans-serif";
	ctx.fillText("☠  MESSAGE DU SYSTÈME  ☠", 600, 582);

	ctx.fillStyle = "#ffffff";
	ctx.font = "italic 20px sans-serif";
	ctx.fillText(insult, 600, 615, 970);

	// Footer
	ctx.fillStyle = "#861029";
	ctx.font = "bold 16px sans-serif";
	ctx.fillText("DARK SYSTEM  •  ACCESS TERMINATED", 600, 665);

	return canvas.createPNGStream();
}

module.exports = {
	config: {
		name: "leave",
		version: "2.0",
		author: "DARK SYSTEM",
		category: "events"
	},

	langs: {
		fr: {},
		en: {},
		vi: {}
	},

	onStart: async ({ threadsData, message, event, api, usersData }) => {
		if (event.logMessageType !== "log:unsubscribe")
			return;

		return async function () {
			const { threadID } = event;
			const threadData = await threadsData.get(threadID);

			if (!threadData.settings.sendLeaveMessage)
				return;

			const { leftParticipantFbId } = event.logMessageData;

			if (!leftParticipantFbId ||
				leftParticipantFbId == api.getCurrentUserID())
				return;

			const userName = await usersData.getName(leftParticipantFbId);
			const threadName = threadData.threadName || "Groupe inconnu";

			const hours = Number(getTime("HH"));

			const session =
				hours <= 10 ? "Matin" :
				hours <= 12 ? "Midi" :
				hours <= 18 ? "Après-midi" :
				"Soir";

			const isKick = leftParticipantFbId != event.author;

			const type = isKick
				? "EXPULSION"
				: "DÉPART VOLONTAIRE";

			const messages = isKick ? kickInsults : insults;
			const insult = messages[
				Math.floor(Math.random() * messages.length)
			];

			const attachment = drawCard({
				userName,
				threadName,
				time: getTime("HH:mm"),
				session,
				type,
				insult
			});

			const form = {
				body: `🥀 ${userName} ${isKick ? "a été expulsé(e) du groupe." : "a quitté le groupe."}\n🖤 DARK SYSTEM`,
				attachment,
				mentions: [{
					id: leftParticipantFbId,
					tag: userName
				}]
			};

			await message.send(form);
		};
	}
};
