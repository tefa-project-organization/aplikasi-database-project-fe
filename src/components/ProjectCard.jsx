const ProjectCard = ({ project }) => {
    return (
      <div className="border border-blue-400 rounded-xl p-4 shadow-lg bg-blue-50">
        <h3 className="text-lg font-semibold">{project.name}</h3>
        <p className="text-sm text-gray-600 mb-3">{project.description}</p>
        <div className="flex gap-2">
          {/* Status Tag */}
          <span className="bg-green-400 text-green-900 text-xs font-medium px-2 py-1 rounded">
            {project.status}
          </span>
          {/* PM Tag */}
          <span className="bg-green-200 text-green-800 text-xs font-medium px-2 py-1 rounded">
            PM: {project.pm}
          </span>
        </div>
      </div>
    );
  };
  export default ProjectCard;