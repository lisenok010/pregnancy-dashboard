import { useEffect, useState } from "react";
import {
  Link2, Plus, Copy, Check, Trash2, Loader2, X,
  ExternalLink, AlertTriangle, CheckCircle, Clock
} from "lucide-react";
import {
  createShareLink, getMyShareLinks, revokeShareLink, deleteShareLink,
  getLinkStatus, buildShareUrl, formatExpiresDate, daysUntilExpiry
} from "../lib/shareLinksApi";

export default function SharePanel() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [busyId, setBusyId] = useState(null);

  const reload = () => {
    setLoading(true);
    getMyShareLinks()
      .then(setLinks)
      .catch((err) => {
        console.error(err);
        setError("Не удалось загрузить ссылки");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { reload(); }, []);

  const handleCreate = async () => {
    setCreating(true);
    setError(null);
    try {
      await createShareLink(30);
      reload();
    } catch (err) {
      console.error(err);
      setError(err.message || "Не удалось создать ссылку");
    } finally {
      setCreating(false);
    }
  };

  const handleCopy = async (token, linkId) => {
    const url = buildShareUrl(token);
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(linkId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error(err);
      // Fallback: показываем prompt
      window.prompt("Скопируй ссылку вручную:", url);
    }
  };

  const handleRevoke = async (linkId) => {
    if (!confirm("Отозвать ссылку? Доктор больше не сможет её открыть.")) return;
    setBusyId(linkId);
    try {
      await revokeShareLink(linkId);
      reload();
    } catch (err) {
      console.error(err);
      alert("Не удалось отозвать");
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (linkId) => {
    if (!confirm("Удалить ссылку из истории навсегда?")) return;
    setBusyId(linkId);
    try {
      await deleteShareLink(linkId);
      reload();
    } catch (err) {
      console.error(err);
      alert("Не удалось удалить");
    } finally {
      setBusyId(null);
    }
  };

  const activeLinks = links.filter((l) => getLinkStatus(l) === "active");
  const inactiveLinks = links.filter((l) => getLinkStatus(l) !== "active");

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
      <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
        <Link2 size={16} className="text-purple-600" />
        <p className="text-[14px] font-medium text-gray-900 flex-1">Ссылки для врача</p>
        <button
          onClick={handleCreate}
          disabled={creating}
          className="text-[12px] font-medium text-white bg-purple-600 hover:bg-purple-700 px-3 py-1.5 rounded-lg flex items-center gap-1.5 disabled:opacity-50"
        >
          {creating ? <Loader2 size={12} className="animate-spin" /> : <Plus size={12} />}
          Создать
        </button>
      </div>

      {loading ? (
        <div className="py-8 flex justify-center">
          <Loader2 size={20} className="animate-spin text-gray-400" />
        </div>
      ) : (
        <div className="p-4">
          {error && (
            <div className="mb-3 bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-[12px] text-red-700">
              {error}
            </div>
          )}

          {links.length === 0 && (
            <div className="text-center py-6">
              <div className="w-12 h-12 mx-auto rounded-full bg-purple-100 flex items-center justify-center mb-2">
                <Link2 size={18} className="text-purple-600" />
              </div>
              <p className="text-[13px] text-gray-900 font-medium mb-1">Поделись с врачом</p>
              <p className="text-[11px] text-gray-500 leading-relaxed">
                Создай ссылку — доктор откроет твой дашборд без регистрации.
              </p>
            </div>
          )}

          {activeLinks.length > 0 && (
            <div className="space-y-2 mb-3">
              {activeLinks.map((link) => (
                <ActiveLinkCard
                  key={link.id}
                  link={link}
                  copied={copiedId === link.id}
                  busy={busyId === link.id}
                  onCopy={() => handleCopy(link.token, link.id)}
                  onRevoke={() => handleRevoke(link.id)}
                />
              ))}
            </div>
          )}

          {inactiveLinks.length > 0 && (
            <div className="border-t border-gray-100 pt-3 space-y-2">
              <p className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">Архив</p>
              {inactiveLinks.map((link) => (
                <InactiveLinkCard
                  key={link.id}
                  link={link}
                  busy={busyId === link.id}
                  onDelete={() => handleDelete(link.id)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ActiveLinkCard({ link, copied, busy, onCopy, onRevoke }) {
  const daysLeft = daysUntilExpiry(link.expires_at);
  const isExpiringSoon = daysLeft <= 3;
  const accessCount = link.access_count || 0;

  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200/50 rounded-xl p-3">
      <div className="flex items-center gap-2 mb-2">
        <CheckCircle size={12} className="text-emerald-600 shrink-0" />
        <p className="text-[11px] font-medium text-emerald-700">Активна</p>
        <span className="text-[10px] text-gray-400">·</span>
        <p className={"text-[11px] " + (isExpiringSoon ? "text-amber-600 font-medium" : "text-gray-500")}>
          {daysLeft > 0 ? "истекает через " + daysLeft + " " + pluralDays(daysLeft) : "истекла"}
        </p>
      </div>

      <p className="text-[10px] text-gray-500 mb-1">Скопируй и отправь врачу:</p>
      <div className="bg-white rounded-lg px-2.5 py-1.5 mb-2 border border-gray-200">
        <p className="text-[11px] text-gray-700 font-mono truncate" title={buildShareUrl(link.token)}>
          {buildShareUrl(link.token)}
        </p>
      </div>

      <div className="flex items-center gap-2 mb-2">
        <button
          onClick={onCopy}
          className="flex-1 text-[12px] font-medium text-white bg-purple-600 hover:bg-purple-700 px-3 py-2 rounded-lg flex items-center justify-center gap-1.5"
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
          {copied ? "Скопировано" : "Скопировать"}
        </button>
        <a
          href={buildShareUrl(link.token)}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[12px] font-medium text-purple-700 hover:text-purple-900 px-3 py-2 rounded-lg border border-purple-200 hover:bg-purple-50 flex items-center gap-1.5"
          title="Посмотреть как видит врач"
        >
          <ExternalLink size={12} />
        </a>
      </div>

      <div className="flex items-center justify-between text-[10px] text-gray-500">
        <span>
          {accessCount === 0 ? "Не открывали" : "Просмотров: " + accessCount}
        </span>
        <button
          onClick={onRevoke}
          disabled={busy}
          className="text-rose-600 hover:text-rose-700 hover:underline disabled:opacity-50 flex items-center gap-1"
        >
          {busy ? <Loader2 size={10} className="animate-spin" /> : null}
          Отозвать
        </button>
      </div>
    </div>
  );
}

function InactiveLinkCard({ link, busy, onDelete }) {
  const status = getLinkStatus(link);
  const isRevoked = status === "revoked";
  return (
    <div className="bg-gray-50 rounded-lg px-3 py-2 flex items-center gap-2">
      {isRevoked ? <X size={12} className="text-rose-500 shrink-0" /> : <Clock size={12} className="text-gray-400 shrink-0" />}
      <div className="flex-1 min-w-0">
        <p className="text-[11px] text-gray-700">
          {isRevoked ? "Отозвана" : "Истекла"} · создана {formatExpiresDate(link.created_at)}
        </p>
        {link.access_count > 0 && (
          <p className="text-[10px] text-gray-400">Просмотров: {link.access_count}</p>
        )}
      </div>
      <button
        onClick={onDelete}
        disabled={busy}
        className="text-gray-400 hover:text-rose-600 disabled:opacity-50"
        title="Удалить из истории"
      >
        {busy ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
      </button>
    </div>
  );
}

function pluralDays(n) {
  if (n % 10 === 1 && n % 100 !== 11) return "день";
  if (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)) return "дня";
  return "дней";
}
