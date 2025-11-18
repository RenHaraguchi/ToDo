import React, {
    useState,
    type ChangeEvent,
    type FormEvent,
} from "react";
import { useNavigate } from "react-router-dom";

type LoginProps = {
    /** 実際のログイン処理（API 呼び出しなど）を親から注入したい場合に利用 */
    onLogin?: (email: string, password: string) => Promise<void> | void;
};

const Login: React.FC<LoginProps> = ({ onLogin }) => {
    const [form, setForm] = useState({
        email: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        if (!form.email || !form.password) {
            setError("メールアドレスとパスワードを入力してください。");
            return;
        }

        try {
            setLoading(true);

            if (onLogin) {
                // 親から渡されたログイン処理を使う場合
                await onLogin(form.email, form.password);
            } else {
                // まだログイン処理を実装していない場合のダミー
                console.log("ログイン処理（ダミー）", form);
            }

            // ログイン成功後に遷移したいパス（必要に応じて変更）
            navigate("/");
        } catch (err) {
            console.error(err);
            setError("ログインに失敗しました。再度お試しください。");
        } finally {
            setLoading(false);
        }
    };

    const handleGoSignUp = () => {
        navigate("/signup");
    };

    const handleForgotPassword = () => {
        navigate("/reset-password");
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100">
            <div className="w-full max-w-md bg-white shadow-lg rounded-2xl px-6 py-8">
                <h2 className="text-center text-lg font-semibold text-slate-800 mb-6">
                    ログイン
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-slate-700"
                        >
                            メールアドレス
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoFocus
                            required
                            value={form.email}
                            onChange={handleChange}
                            placeholder="メールアドレスを入力"
                            className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-slate-700"
                        >
                            パスワード
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            value={form.password}
                            onChange={handleChange}
                            placeholder="パスワードを入力"
                            className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        />
                    </div>

                    {error && (
                        <p className="text-xs text-red-600 mt-1">{error}</p>
                    )}

                    <div className="space-y-2 pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${loading ? "opacity-70 cursor-not-allowed" : ""
                                }`}
                        >
                            {loading ? "ログイン中..." : "ログイン"}
                        </button>

                        <button
                            type="button"
                            onClick={handleGoSignUp}
                            className="w-full inline-flex items-center justify-center rounded-md border border-emerald-600 px-4 py-2 text-sm font-semibold text-emerald-700 bg-white hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                        >
                            新規登録
                        </button>

                        <button
                            type="button"
                            onClick={handleForgotPassword}
                            className="w-full inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-emerald-700 bg-transparent hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                        >
                            パスワードをお忘れですか？
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
