import { useState, useEffect } from 'react';
import { api } from '../api/axiosConfig';

export const useProblem = (matchId) => {
    const [problem, setProblem] = useState(null);
    const [statement, setStatement] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!matchId) return;

        const load = async () => {
            try {
                // 1. Получаем мета-инфу о задаче через бэкенд
                const { data: problemInfo } = await api.get(`/problems/by-match/${matchId}`);
                setProblem(problemInfo);

                // 2. Загружаем условие из нужного сервиса
                if (problemInfo.type === 'SQL') {
                    // SqlService: GET /sqlservice/tasks/{externalId}
                    const { data: taskResp } = await api.get(
                        `${import.meta.env.VITE_SQLSERVICE_URL}/sqlservice/tasks/${problemInfo.externalId}`
                    );
                    // ApiResponse обёртка
                    const task = taskResp.data ?? taskResp;
                    setStatement(task.description || task.title || 'Нет условия');
                } else {
                    // Artefactik0: GET /api/problems/{externalId}/statement
                    const { data: stmt } = await api.get(
                        `${import.meta.env.VITE_ARTEFACTIK_URL}/api/problems/${problemInfo.externalId}/statement`
                    );
                    setStatement(stmt);
                }
            } catch (err) {
                console.error('Failed to load problem:', err);
                setStatement('Не удалось загрузить условие задачи.');
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [matchId]);

    return { problem, statement, loading };
};