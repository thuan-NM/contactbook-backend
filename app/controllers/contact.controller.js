const ApiError = require("../api-error");
const ContactService = require("../services/contact.service");
const MongoDB = require("../utils/mongodb.util");

const create = async (req,res,next) =>{
    if(!req.body?.name) {
        return new(new ApiError(400,"Name can not be empty"));
    }

    try {
        const contactService = new ContactService(MongoDB.client);
        const document = await contactService.create(req.body);
        return res.json({
            data: document,
            message: "Success",
        });
    }catch(error) {
        return next(
            new ApiError(500, "An error occurred while creating the contact")
        );
    }
};

const findALL = async (req,res,next) =>{
    let document = [];
    try {
        const contactService = new ContactService(MongoDB.client);
        const {name} = req.query;
        if(name) {
            document = await contactService.findByName(name);
            res.json({
                data: document,
                message: "FindByName success",
            })
        }else {
            document = await contactService.find({});
            res.json({
                data: document,
                message: "Find success",
            })
        }
    }catch(error) {
        return next(
            new ApiError(500, "An error occurred while creating the contact")
        );
    }
};

const findOne = async (req,res,next) =>{
    try{
        const contactService = new ContactService(MongoDB.client);
        const document = await contactService.findById(req.params.id);
        if (!document) {
            return new(new ApiError(404, "Contact not found"));
        }
        return res.json({
            data: document,
            message: "Success"
        })
    } catch (error){
        return next(
            new ApiError(500, `Error retrieving contact with id=${req.params.id}`)
        );
    }
};

const update = async (req,res,next) =>{
    if (Object.keys(req.body).length === 0) {
        return next(
            new ApiError(400, "Data to update can not be empty")
        );
    }
    try {
        const contactService = new ContactService(MongoDB.client);
        const document = await contactService.update(req.params.id, req.body);
        if(!document){
            return next(
                new ApiError(404, "Contact not found")
            );
        }
        else return res.json({message: "Contact was updated successfully"},)
    } catch (error) {
        return next(
            new ApiError(500, `Error retrieving contact with id=${req.params.id}`)
        );
    }
};

const deleteOne = async (req,res,next) =>{
    try{
        const contactService = new ContactService(MongoDB.client);
        const document = await contactService.delete(req.params.id);
        if(!document){
            return next(
                new ApiError(404, "Contact not found")
            );
        }
        else return res.json({message: "Contact was deleted successfully"});
    }catch(error){
        return next(
            new ApiError(500, `Error retrieving contact with id=${req.params.id}`)
        );
    }
};

const deleteAll = async (req,res,next) =>{
    try{
        const contactService = new ContactService(MongoDB.client);
        const deletedCount = await contactService.deleteAll();
        return res.json({
            message: `${deletedCount} contacts were deteled successfully`,
        });
    }catch(error){
        return next(
            new ApiError(500, "An error occurred while retrieving favorite contacts")
        );
    }
};

const findAllFavorite = async (req,res,next) =>{
    try{
        const contactService = new ContactService(MongoDB.client);
        const document = await contactService.findFavorite();
        return res.json({
            message: "Find Favorite successfully",
            data: document
        })
    }catch(error){
        return next(
            new ApiError(500, "An error occurred while retrieving favorite contacts")
        );
    }
};

module.exports = {create,findALL,findOne,update,deleteOne,deleteAll,findAllFavorite};