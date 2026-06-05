import type { FC } from "react";
import { MessageSquare } from "lucide-react";
import type { Review } from "@/types";

export const ReviewReplyList: FC<{ replies: Review["replies"] }> = ({ replies }) => (
  <div className="mt-5 rounded-xl border border-slate-100 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900/60">
    <div className="mb-3 flex items-center gap-2">
      <MessageSquare size={15} className="text-emerald-600 dark:text-emerald-500" />
      <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Balasan Anda</p>
    </div>
    {replies?.map((reply) => (
      <p key={reply.id} className="text-sm leading-relaxed text-slate-600 dark:text-slate-400 whitespace-pre-wrap">
        {reply.reply_text}
      </p>
    ))}
  </div>
);
