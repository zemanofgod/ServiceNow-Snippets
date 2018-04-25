
Counting("sys_attachment"); //tablename

function Counting(table) {
    var grPhotos = new GlideAggregate(table);
    grPhotos.addEncodedQuery("file_nameLIKEtf1photo");
    grPhotos.addAggregate('COUNT');
    grPhotos.query();
    var userPhoto = 0;
    if (grPhotos.next()) {
        userPhoto = grPhotos.getAggregate('COUNT');
        gs.print('userPhoto count: ' + userPhoto);
    }
}


MassDelete("sys_attachment"); //tablename

function MassDelete(table) {
    var grPhotos = new GlideRecord('sys_attachment');
    grPhotos.addEncodedQuery("file_nameLIKEtf1photo");
    grPhotos.setWorkflow(false);
    //grPhotos.setLimit(1000);
    grPhotos.deleteMultiple();
}
