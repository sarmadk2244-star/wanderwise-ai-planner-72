import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { checkIsAdmin } from "@/lib/admin.functions";
import { supabase } from "@/integrations/supabase/client";

export function useIsAdmin() {
  const check = useServerFn(checkIsAdmin);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function run() {
      try {
        const { data } = await supabase.auth.getUser();
        if (!data.user) {
          if (active) {
            setIsAdmin(false);
            setLoading(false);
          }
          return;
        }
        const res = await check();
        if (active) {
          setIsAdmin(!!res.isAdmin);
          setLoading(false);
        }
      } catch {
        if (active) {
          setIsAdmin(false);
          setLoading(false);
        }
      }
    }
    run();
    const { data: sub } = supabase.auth.onAuthStateChange(() => run());
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [check]);

  return { isAdmin, loading };
}
