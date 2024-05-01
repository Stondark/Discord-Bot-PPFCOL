const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { embedPaginator } = require("../../utils/paginator")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('tutorial')
        .setDescription('Aprende cómo obtener la cookie de PPF para registrarte'),
    async execute(interaction) {
        const embeds = [];

        const firstEmbed = new EmbedBuilder()
            .setTitle("Tutorial")
            .setThumbnail('https://i.imgur.com/MKEfQXJ.png')
            .setDescription(`Lo primero que deberás hacer será ir a la página de PPF (*DEBES TENER LA SESIÓN INICIADA*). Una vez hecho esto deberás darle click derecho y luego a inspeccionar`)
            .setImage('https://i.imgur.com/RDbvHPf.png')
            .setColor("#E1FF00");

        embeds.push(firstEmbed);

        const secondEmbed = new EmbedBuilder()
            .setTitle("Tutorial")
            .setThumbnail('https://i.imgur.com/MKEfQXJ.png')
            .setDescription(`Después se desplegará una ventana en un costado, deberás buscar el apartado de 'Aplicación'`)
            .setImage('https://i.imgur.com/iJWFiWB.png')
            .setColor("#E1FF00");

        embeds.push(secondEmbed);

        const ThirdEmbed = new EmbedBuilder()
            .setTitle("Tutorial")
            .setThumbnail('https://i.imgur.com/MKEfQXJ.png')
            .setDescription(`Una vez hecho esto deberás buscar el apartado de Cookies, estando ahí darás click a la página pixelplanet.fun y buscarás uno llamado ppfun.session y tomarás el valor. Como en la imagen`)
            .setImage('https://i.imgur.com/l5J1Aoy.png')
            .setColor("#E1FF00");

        embeds.push(ThirdEmbed);

        const fourthEmbed = new EmbedBuilder()
            .setTitle("Tutorial")
            .setThumbnail('https://i.imgur.com/MKEfQXJ.png')
            .setDescription(`Asegúrate de copiar por completo la Cookie ya que este es un valor de más de 40 carácteres. Puedes dar doble click para que se seleccione por completo`)
            .setImage('https://i.imgur.com/Zys7yjU.png')
            .setColor("#E1FF00");

        embeds.push(fourthEmbed);

        const FifthEmbed = new EmbedBuilder()
            .setTitle("Tutorial")
            .setThumbnail('https://i.imgur.com/MKEfQXJ.png')
            .setDescription(`Esta será la *cookie* que usarás para registrarte y en caso de que necesites actualizar :D`)
            .setImage('https://i.imgur.com/wNejI5z.png')
            .setColor("#E1FF00");

        embeds.push(FifthEmbed);


        await embedPaginator(interaction, embeds);
    },
};