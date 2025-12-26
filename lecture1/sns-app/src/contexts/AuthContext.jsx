import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

/**
 * AuthContext
 *
 * 사용자 인증 상태를 관리하는 컨텍스트
 * 프로토타입이므로 간단한 세션 기반 인증 사용
 */
const AuthContext = createContext(null);

/**
 * AuthProvider 컴포넌트
 *
 * Props:
 * @param {ReactNode} children - 자식 컴포넌트 [Required]
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('sns_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    const { data } = await supabase
      .from('sns_users')
      .select('*')
      .eq('username', username)
      .eq('password', password)
      .maybeSingle();

    if (!data) {
      throw new Error('아이디 또는 비밀번호가 올바르지 않습니다.');
    }

    setUser(data);
    localStorage.setItem('sns_user', JSON.stringify(data));
    return data;
  };

  const register = async (username, nickname, password) => {
    const { data: existingUser } = await supabase
      .from('sns_users')
      .select('id')
      .eq('username', username)
      .maybeSingle();

    if (existingUser) {
      throw new Error('이미 사용 중인 아이디입니다.');
    }

    const { data, error } = await supabase
      .from('sns_users')
      .insert([{ username, nickname, password }])
      .select()
      .single();

    if (error) {
      throw new Error('회원가입에 실패했습니다.');
    }

    return data;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('sns_user');
  };

  const updateUser = (updatedData) => {
    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);
    localStorage.setItem('sns_user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
