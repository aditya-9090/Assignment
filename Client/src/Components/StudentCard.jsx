const StudentCard = ({ student, onEdit, onDelete }) => {
  const courseTitle = student.course?.title || "Not assigned";

  return (
    <div className="flex h-full flex-col gap-3 rounded border border-slate-200 bg-white p-4">
      <div className="space-y-1">
        <h3 className="text-base font-semibold text-slate-900">{student.name}</h3>
        <p className="text-sm text-slate-600">{student.email}</p>
        <p className="text-sm text-slate-600">Course: {courseTitle}</p>
      </div>

      <div className="mt-auto flex items-center gap-2">
        <button
          onClick={onEdit}
          className="flex-1 rounded border border-slate-300 px-3 py-2 text-sm text-slate-600 hover:border-slate-400"
        >
          Edit
        </button>
        <button
          onClick={onDelete}
          className="flex-1 rounded bg-slate-900 px-3 py-2 text-sm text-white hover:bg-slate-800"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default StudentCard;

