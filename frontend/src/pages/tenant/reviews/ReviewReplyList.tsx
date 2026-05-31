import type { FC } from "react";
import { MessageSquare } from "lucide-react";
import type { Review } from "@/types";

export const ReviewReplyList: FC<{ replies: Review["replies"] }> = ({ replies }) => (
  <div className="bg-gray-50 dark:bg-slate-900/50 rounded-xl p-5 ml-4 sm:ml-8 border dark:border-slate-700"><div className="flex items-center gap-2 mb-2"><MessageSquare size={16} className="text-emerald-600 dark:text-emerald-500" /><p className="font-semibold text-sm text-gray-900 dark:text-white">Balasan Anda</p></div>{replies?.map((reply) => <p key={reply.id} className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{reply.reply_text}</p>)}</div>
);
