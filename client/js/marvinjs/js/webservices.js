// Define the default location of webservices

function getDefaultServicesPrefix() {
	var servername = "http://202.127.19.75:5210";
	var webapp = "/webservices";
	return servername + webapp;
}

function getDefaultServices() {
	var base = getDefaultServicesPrefix();
	var services = {
			"clean2dws" : base + "/rest-v0/util/convert/clean",
			"clean3dws" : base + "/rest-v0/util/convert/clean",
			"molconvertws" : base + "/rest-v0/util/calculate/molExport",
			"stereoinfows" : base + "/rest-v0/util/calculate/cipStereoInfo",
			"reactionconvertws" : base + "/rest-v0/util/calculate/reactionExport",
			"hydrogenizews" : base + "/rest-v0/util/convert/hydrogenizer",
			"automapperws" : base + "/rest-v0/util/convert/reactionConverter"
	};
	return services;
}