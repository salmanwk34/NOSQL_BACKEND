const Project = require('../models/project.model');

exports.project_all = function (req, res) {
    Project.find({}, function(err, projects) {
        if (err) {
            res.send(err);
        } else {
            res.json(projects);
        }
    });
};

exports.project_details = function (req, res) {
    Project.findById(req.params.id, function(err, project) {
        if (err) {
            res.send(err);
        } else {
            res.json(project);
        }
    });
};

exports.project_create = function (req, res) {
    let project = new Project({
        name: req.body.name,
        description: req.body.description,
    });
    project.save(function(err) {
        if (err) {
            res.send(err);
        } else {
            res.json(project);
        }
    });
};

exports.project_update = function (req, res) {
    Project.findByIdAndUpdate(req.params.id, {$set: req.body}, function(err, project) {
        if (err) {
            res.send(err);
        } else {
            res.json(project);
        }
    });
};

exports.project_delete = function (req, res) {
    Project.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            res.send(err);
        } else {
            res.json({status: "success", message: "Project deleted successfully"});
        }
    });
};
