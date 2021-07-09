\c "frinx";

COPY public.uniconfig_zones (id, name, tenant_id) FROM stdin;
1	zone1	frinx
2	zone2	frinx
3	zone3	tenant1
\.
SELECT pg_catalog.setval('public.uniconfig_zones_id_seq', 3, true);

COPY public.device_inventory (id, name, uniconfig_zone, role, management_ip, model, sw, sw_version, vendor, mount_parameters, username, password) FROM stdin;
1	mnd-gt0002-cpe4.test	1	l2-cpe	1.2.3.4	3930	saos	6	ciena	{"protocol": "ssh", "port": "22", "parsing-engine": "one-line-parser"}	admin	admin
2	mnd-gt0002-cpe5.test	1	l2-cpe	1.2.3.5	3931	saos	7	ciena	{"protocol": "ssh", "port": "22", "parsing-engine": "one-line-parser"}	admin	admin
\.
SELECT pg_catalog.setval('public.uniconfig_zones_id_seq', 1, true);
