import { usePermission } from "../Hooks/usePermission";
import { useAuth } from "../Context/AuthContext";



function CourseCard({ course, onEdit, onDelete, onViewStudents }) {
  const canDelete = usePermission("delete");
  const canEdit = usePermission("edit");

  const { user } = useAuth();

  const attachment = course.attachment;
  const hasImage = typeof attachment === "string" && attachment.match(/\.(jpe?g|png|gif|webp|svg)$/i);
  const formattedDate = course.startDate ? new Date(course.startDate).toLocaleDateString() : "—";

  return (
    <article className="flex h-full flex-col overflow-hidden rounded border border-slate-200 bg-white">
      <div className="h-36 w-full bg-slate-100">
        {hasImage && attachment ? (
          <img
            src={attachment}
            alt={`${course.title} cover`}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-slate-500">
            No image
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <h3 className="text-base font-semibold text-slate-900">{course.title}</h3>
        <p className="text-sm text-slate-600">{course.description}</p>

        <div className="mt-auto space-y-1 text-sm text-slate-600">
          <p>Budget: ₹{course.budget ?? "—"}</p>
          <p>Start date: {formattedDate}</p>
        </div>

        <div className="flex items-center justify-end gap-2">
        {user.role === "admin" && <button
            onClick={() => onViewStudents(course)}
            className="rounded border border-slate-300 px-3 py-1.5 text-sm text-slate-600 hover:border-slate-400"
          >
            Enrolled Students
          </button>}
          {canEdit && (
            <button
              onClick={() => onEdit(course)}
              className="rounded border border-slate-300 px-3 py-1.5 text-sm text-slate-600 hover:border-slate-400"
            >
              Edit
            </button>
          )}
          {canDelete && (
            <button
              onClick={() => onDelete(course._id)}
              className="rounded bg-slate-900 px-3 py-1.5 text-sm text-white hover:bg-slate-800"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

export default CourseCard;
