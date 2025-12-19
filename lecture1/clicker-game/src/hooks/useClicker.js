import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '../lib/supabase';

/**
 * useClicker 훅
 *
 * 클릭 로직을 관리하는 커스텀 훅
 * - 로컬 state로 즉시 카운트 증가
 * - 2초마다 배치로 서버에 저장
 * - 페이지 이탈 시 남은 클릭수 저장
 *
 * @param {string} odPlayeri - 플레이어 UUID [Required]
 * @param {number} initialClicks - 초기 클릭 수 [Optional, 기본값: 0]
 * @returns {Object} { clicks, handleClick, isSaving }
 */
const useClicker = (playerId, initialClicks = 0) => {
  const [clicks, setClicks] = useState(initialClicks);
  const [isSaving, setIsSaving] = useState(false);
  const pendingClicksRef = useRef(0);
  const saveIntervalRef = useRef(null);

  // 서버에 클릭수 저장하는 함수
  const saveToServer = useCallback(async () => {
    if (!playerId || pendingClicksRef.current === 0) return;

    const clicksToSave = pendingClicksRef.current;
    pendingClicksRef.current = 0;

    setIsSaving(true);
    try {
      const { error } = await supabase.rpc('increment_clicks', {
        player_id: playerId,
        click_count: clicksToSave
      });

      if (error) {
        // 실패 시 pending에 다시 추가
        pendingClicksRef.current += clicksToSave;
        console.error('클릭 저장 실패:', error);
      }
    } catch (err) {
      pendingClicksRef.current += clicksToSave;
      console.error('클릭 저장 오류:', err);
    } finally {
      setIsSaving(false);
    }
  }, [playerId]);

  // 클릭 핸들러
  const handleClick = useCallback(() => {
    setClicks((prev) => prev + 1);
    pendingClicksRef.current += 1;
  }, []);

  // 2초마다 배치 저장
  useEffect(() => {
    if (!playerId) return;

    saveIntervalRef.current = setInterval(() => {
      saveToServer();
    }, 2000);

    return () => {
      if (saveIntervalRef.current) {
        clearInterval(saveIntervalRef.current);
      }
    };
  }, [playerId, saveToServer]);

  // 페이지 이탈 시 저장
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (pendingClicksRef.current > 0 && playerId) {
        // Beacon API 사용하여 비동기적으로 저장
        const data = JSON.stringify({
          player_id: playerId,
          click_count: pendingClicksRef.current
        });

        navigator.sendBeacon(
          `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/rpc/increment_clicks`,
          new Blob([data], { type: 'application/json' })
        );
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [playerId]);

  // 초기 클릭수 설정
  useEffect(() => {
    setClicks(initialClicks);
  }, [initialClicks]);

  return { clicks, handleClick, isSaving };
};

export default useClicker;
