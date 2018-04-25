var usr = new GlideRecord('sys_user');
var target.sys_id = "40d10118376bfe002209261953990ea6";
usr.get(target.sys_id);
//function to attach a new photo from the Workday to the SN-record
function attachPhoto() {
    var sysDecodedAttachment = new GlideSysAttachment();
    var DecodedBytes = GlideStringUtil.base64DecodeAsBytes(source.u_wd_image);
    var attID = sysDecodedAttachment.write(usr, 'photo', 'image/jpeg', DecodedBytes);

    var newAttachment = new GlideRecord("sys_attachment");
    newAttachment.addQuery("sys_id", attID);
    newAttachment.query();

    if (newAttachment.next()) {
        newAttachment.table_name = "ZZ_YYsys_user";
        newAttachment.table_sys_id = usr.sys_id;
        newAttachment.content_type = 'image/jpeg';
        newAttachment.update();
    }
}

//check if Live Profile exists for user, if not create record
var liveProfile = new GlideRecord('live_profile');
liveProfile.addQuery('table', 'sys_user');
liveProfile.addQuery('type', 'user');
liveProfile.addQuery('document', usr.sys_id);
liveProfile.query();

if (!liveProfile.next()) {
    liveProfile.initialize();
    liveProfile.type = 'user';
    liveProfile.table = 'sys_user';
    liveProfile.document = usr.sys_id;
    liveProfile.name = usr.name;
    liveProfile.insert();
}

//check for existing Live Profile image
var existingProfile = new GlideRecord('sys_attachment');
existingProfile.addQuery('table_name', 'ZZ_YYlive_profile');
existingProfile.addQuery('table_sys_id', liveProfile.sys_id);
existingProfile.addQuery('file_name', 'photo');
existingProfile.query();
//**check if there is a picture on Workday
if (source.u_wd_image != '') {
    //**if there is no picture for the profile record in SN
    if (!existingProfile.next()) {
        //**launch the function to attach the picture
        attachProfile();
    }
    //**if there is a profile picture for the record in SN
    else {
        var sysEncodedAttachment2 = new GlideSysAttachment();
        var binData2 = sysEncodedAttachment2.getBytes(existingProfile);
        var EncodedBytes2 = GlideStringUtil.base64Encode(binData2);
        //**verify if the current existing SN-picture for the record does not match the current LDAP picture
        //if it does not match, delete the current SN-picture and launch the funtion to attach the new picture
        if (EncodedBytes2 != source.u_wd_image) {
            existingProfile.deleteRecord();
            attachProfile();
        }
    }
}
//**if there is no picture on Workday
else {
    //**check if there is one on the SN-record and delete it
    if (existingProfile.next()) {
        existingProfile.deleteRecord();
    }
}
function attachProfile() {
    var sysDecodedAttachment2 = new GlideSysAttachment();
    var DecodedBytes2 = GlideStringUtil.base64DecodeAsBytes(source.u_wd_image);
    var attID2 = sysDecodedAttachment2.write(liveProfile, 'photo', 'image/jpeg', DecodedBytes2);
    var newAttachment2 = new GlideRecord("sys_attachment");
    newAttachment2.addQuery("sys_id", attID2);
    newAttachment2.query();
    if (newAttachment2.next()) {
        newAttachment2.table_name = "ZZ_YYlive_profile";
        newAttachment2.table_sys_id = liveProfile.sys_id;
        newAttachment2.content_type = 'image/jpeg';
        newAttachment2.update();
    }
}