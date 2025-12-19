import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

/**
 * useRanking 훅
 *
 * 랭킹 조회를 관리하는 커스텀 훅
 * - Realtime 대신 3초마다 polling으로 TOP 10 조회
 * - 클릭수 내림차순 정렬
 *
 * @returns {Object} { ranking, isLoading, error, refetch }
 */
const useRanking = () => {
  const [ranking, setRanking] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // 랭킹 조회 함수
  const fetchRanking = useCallback(async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('players')
        .select('id, nickname, clicks')
        .order('clicks', { ascending: false })
        .limit(10);

      if (fetchError) {
        setError(fetchError.message);
        return;
      }

      setRanking(data || []);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 3초마다 polling
  useEffect(() => {
    fetchRanking();

    const intervalId = setInterval(() => {
      fetchRanking();
    }, 3000);

    return () => {
      clearInterval(intervalId);
    };
  }, [fetchRanking]);

  return { ranking, isLoading, error, refetch: fetchRanking };
};

export default useRanking;
