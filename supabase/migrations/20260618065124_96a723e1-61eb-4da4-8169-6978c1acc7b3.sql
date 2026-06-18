
-- 1) Lock down user_roles: only admins can INSERT/UPDATE/DELETE.
-- The existing ALL policy is permissive; add explicit command-scoped admin policies
-- so there is no path for a non-admin to insert a row (e.g. granting themselves admin).
DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;

CREATE POLICY "Admins can insert roles"
ON public.user_roles FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update roles"
ON public.user_roles FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete roles"
ON public.user_roles FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- 2) Tighten contact_messages INSERT: replace WITH CHECK (true) with structural checks.
DROP POLICY IF EXISTS "Anyone can submit contact messages" ON public.contact_messages;

-- Anonymous submissions: user_id MUST be null; basic field length sanity to deter abuse.
CREATE POLICY "Anonymous can submit contact messages"
ON public.contact_messages FOR INSERT TO anon
WITH CHECK (
  user_id IS NULL
  AND char_length(name) BETWEEN 1 AND 200
  AND char_length(email) BETWEEN 3 AND 320
  AND char_length(subject) BETWEEN 1 AND 200
  AND char_length(message) BETWEEN 1 AND 5000
  AND admin_reply IS NULL
  AND replied_by IS NULL
  AND replied_at IS NULL
  AND status = 'open'
);

-- Authenticated submissions: user_id MUST match auth.uid().
CREATE POLICY "Authenticated can submit contact messages"
ON public.contact_messages FOR INSERT TO authenticated
WITH CHECK (
  user_id = auth.uid()
  AND char_length(name) BETWEEN 1 AND 200
  AND char_length(email) BETWEEN 3 AND 320
  AND char_length(subject) BETWEEN 1 AND 200
  AND char_length(message) BETWEEN 1 AND 5000
  AND admin_reply IS NULL
  AND replied_by IS NULL
  AND replied_at IS NULL
  AND status = 'open'
);

-- 3) Revoke EXECUTE on the SECURITY DEFINER helper from public roles.
-- It is still callable from inside RLS policies because policy evaluation uses the
-- policy/function owner, not the invoking role.
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO service_role;
