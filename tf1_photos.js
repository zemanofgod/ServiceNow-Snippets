//On récupère le sysID de la photo importée par MAP2 et le sysID du user target
var tf1photo = source.u_tf1photo;
var userSysID = target.sys_id;
var ProfileSysID = "";

//On éxecute la suite du script seulement si MAP2 à envoyé une photo
if (tf1photo) {
	//On recherche le user grace à ons sysID
	var grUser = new GlideRecord('sys_user');
	grUser.get(userSysID);
	
	//On vérifie si le user à un liveprofile
	var liveProfile = new GlideRecord('live_profile');
	liveProfile.addQuery('table', 'sys_user');
	liveProfile.addQuery('type', 'user');
	liveProfile.addQuery('document', userSysID);
	liveProfile.query();
	//Si le user à un liveprofile, on récupère le sysID du liveprofile pour executer la fonction attachPhotoToProfile
	if (liveProfile.next()) {
		ProfileSysID = liveProfile.sys_id;
		if (!liveProfile.photo.getDisplayValue()) {
			attachPhotoToProfile(ProfileSysID);
		}
	}
	//Si le user n'a pas de liveprofile, on le crée et on récupère le sysID du liveprofile pour executer la fonction attachPhotoToProfile
	else {
		liveProfile.initialize();
		liveProfile.type = 'user';
		liveProfile.table = 'sys_user';
		liveProfile.document = userSysID;
		liveProfile.name = grUser.name;
		liveProfile.insert();
		ProfileSysID = liveProfile.sys_id;
		attachPhotoToProfile(ProfileSysID);
	}
}

//On récupère le sysID du liveprofile
function ADDEattachPhotoToProfile(ProfileSysID) {
	var photoGR = new GlideRecord('sys_attachment');
	//On recherche la photo envoyée par MAP2 pour la transfomer en photo de liveprofile
	if (photoGR.get(tf1photo)) {
		photoGR.file_name = "photo";
		photoGR.content_type = "image/png";
		photoGR.table_name = "ZZ_YYlive_profile";
		photoGR.table_sys_id = ProfileSysID;
		photoGR.update();
		
	}
}
