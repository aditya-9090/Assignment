import { useCallback, useMemo, useEffect, useState } from "react";
import auditApi from "../Api/auditApi";
import dayjs from "dayjs";
import Table from "../Components/Table";
import { useDebounce } from "use-debounce";


const formatDate = (value) => {
    if (!value) return "-";
    const date = dayjs(value);
    if (!date.isValid()) return value;
    return date.format('DD MMM YYYY, hh:mm A');
  };

  
const AuditLogs = () => {
  const [courseLogs, setCourseLogs] = useState([]);
  const [userLogs, setUserLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [coursePage, setCoursePage] = useState(1);
  const [userPage, setUserPage] = useState(1);
  const [courseSearch, setCourseSearch] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const [courseTotalPages, setCourseTotalPages] = useState(1);
  const [userTotalPages, setUserTotalPages] = useState(1);

  const [debouncedCourseSearch] = useDebounce(courseSearch, 300);
  const [debouncedUserSearch] = useDebounce(userSearch, 300);

  useEffect(() => {
    setCoursePage(1);
  }, [debouncedCourseSearch]);

  useEffect(() => {
    setUserPage(1);
  }, [debouncedUserSearch]);

  const fetchLogs = useCallback(async () => {
    setLoading(true);

    try {
      const limit = 5;
      const [courseRes, userRes] = await Promise.all([
        auditApi.get("/course/audit-log", {
          params: {
            page: coursePage,
            limit,
            search: debouncedCourseSearch || undefined,
          },
        }),
        auditApi.get("/user/audit-log", {
          params: {
            page: userPage,
            limit,
            search: debouncedUserSearch || undefined,
          },
        }),
      ]);

      const courseData = courseRes.data || {};
      const userData = userRes.data || {};

      setCourseLogs(courseData.data || []);
      setUserLogs(userData.data || []);
      const nextCourseTotal = Math.max(courseData.totalPages || 1, 1);
      const nextUserTotal = Math.max(userData.totalPages || 1, 1);
      setCourseTotalPages(nextCourseTotal);
      setUserTotalPages(nextUserTotal);

      if (coursePage > nextCourseTotal) {
        setCoursePage(nextCourseTotal);
      }
      if (userPage > nextUserTotal) {
        setUserPage(nextUserTotal);
      }
    } catch (err) {
      console.error("Failed to load audit logs:", err);
    } finally {
      setLoading(false);
    }
  }, [coursePage, userPage, debouncedCourseSearch, debouncedUserSearch]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const courseColumns = useMemo(
    () => [
      { key: "courseTitle", label: "Course", render: (value) => value || "-" },
      { key: "courseId", label: "Course ID", render: (value) => value || "-" },
      {
        key: "deletedAt",
        label: "Deleted At",
        render: (value) => formatDate(value),
      },
      {
        key: "deletedByName",
        label: "Deleted By Name",
        render: (_, row) => row.deletedBy?.name || "-",
      },
      {
        key: "deletedByEmail",
        label: "Deleted By Email",
        render: (_, row) => row.deletedBy?.email || "-",
      },
      {
        key: "deletedByRole",
        label: "Deleted By Role",
        render: (_, row) => row.deletedBy?.role || "-",
      },
    ],
    []
  );

  const userColumns = useMemo(
    () => [
      { key: "userName", label: "Name", render: (value) => value || "-" },
      { key: "userEmail", label: "Email", render: (value) => value || "-" },
      { key: "userId", label: "User ID", render: (value) => value || "-" },
      {
        key: "deletedAt",
        label: "Deleted At",
        render: (value) => formatDate(value),
      },
      {
        key: "deletedByName",
        label: "Deleted By Name",
        render: (_, row) => row.deletedBy?.name || "-",
      },
      {
        key: "deletedByEmail",
        label: "Deleted By Email",
        render: (_, row) => row.deletedBy?.email || "-",
      },
      {
        key: "deletedByRole",
        label: "Deleted By Role",
        render: (_, row) => row.deletedBy?.role || "-",
      },
    ],
    []
  );

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-4">
      <header>
        <h1 className="text-2xl font-semibold text-slate-800">Microservice 2 Audit Logs</h1>
        <p className="text-sm text-slate-500">
          audit microservice list the deleted courses and users.
        </p>
      </header>

      <section className="space-y-3">
        <div className="flex items-center justify-between px-1 py-0">
          <h2 className="text-lg font-semibold text-slate-700">Course Deletion Logs</h2>
          {loading && <span className="text-xs text-slate-400">Loading…</span>}
        </div>
        <Table
          columns={courseColumns}
          data={courseLogs}
          page={coursePage}
          setPage={setCoursePage}
          search={courseSearch}
          setSearch={setCourseSearch}
          enableSearch
          emptyMessage="No course logs recorded yet."
          totalPages={courseTotalPages}
        />
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between px-1 py-0">
          <h2 className="text-lg font-semibold text-slate-700">User Deletion Logs</h2>
          {loading && <span className="text-xs text-slate-400">Loading…</span>}
        </div>
        <Table
          columns={userColumns}
          data={userLogs}
          page={userPage}
          setPage={setUserPage}
          search={userSearch}
          setSearch={setUserSearch}
          enableSearch
          emptyMessage="No user logs recorded yet."
          totalPages={userTotalPages}
        />
      </section>
    </div>
  );
};

export default AuditLogs;
