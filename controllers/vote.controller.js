// controllers/vote.controller.js

const Project = require('../models/project.model');

exports.vote = async (req, res) => {
  const projectId = req.params.projectId;
  try {
    // Trouver le projet
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Augmenter le compteur de votes
    project.votes += 1;
    
    // Sauvegarder le projet
    await project.save();

    res.status(200).json({ message: 'Vote counted' });
  } catch (err) {
    res.status(500).json({ message: 'Error voting for project' });
  }
};
