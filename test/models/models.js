'use strict'

 //This class is mapped with t_personnes table in database TEST//
class t_personnes {
	constructor(id,name,sex,phone,iddepart) {
		this.id=id;
		this.name=name;
		this.sex=sex;
		this.phone=phone;
		this.iddepart=iddepart;


	}
	
}
exports.t_personnes=t_personnes