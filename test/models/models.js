

 //This class is mapped with commentaires table in database TEST//
class commentaires {
	constructor(id,dateComment,user,country) {
		this.id=id;
		this.dateComment=dateComment;
		this.user=user;
		this.country=country;


	}
	
}
exports.commentaires=commentaires

 //This class is mapped with editions table in database TEST//
class editions {
	constructor(id,dateEdition,Other,yearPublish) {
		this.id=id;
		this.dateEdition=dateEdition;
		this.Other=Other;
		this.yearPublish=yearPublish;


	}
	
}
exports.editions=editions

 //This class is mapped with personne table in database TEST//
class personne {
	constructor(id,name,sex,phone) {
		this.id=id;
		this.name=name;
		this.sex=sex;
		this.phone=phone;


	}
	
}
exports.personne=personne