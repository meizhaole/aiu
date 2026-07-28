import { Pool } from '@neondatabase/serverless';

const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
});

function sendJson(res, statusCode, payload) {
	res.status(statusCode).json(payload);
}

function getTrimmedString(value) {
	if (typeof value !== 'string') {
		return '';
	}

	return value.trim();
}

function isValidChinaPhone(phone) {
	return /^1[3-9]\d{9}$/.test(phone);
}

export default async function handler(req, res) {
	if (req.method !== 'POST') {
		res.setHeader('Allow', 'POST');
		return sendJson(res, 405, { success: false, message: 'Method Not Allowed' });
	}

	const contentType = req.headers['content-type'] || '';

	if (!contentType.includes('application/json') && typeof req.body !== 'object') {
		return sendJson(res, 400, { success: false, message: '请求体必须是 JSON 格式' });
	}

	let body = req.body;

	if (typeof body === 'string') {
		try {
			body = JSON.parse(body);
		} catch {
			return sendJson(res, 400, { success: false, message: 'JSON 解析失败' });
		}
	}

	if (!body || typeof body !== 'object') {
		return sendJson(res, 400, { success: false, message: '请求体无效' });
	}

	const name = getTrimmedString(body.name);
	const college = getTrimmedString(body.college);
	const gradeMajorClass = getTrimmedString(body.gradeMajorClass) || getTrimmedString(body.class);
	const phone = getTrimmedString(body.phone);
	const firstChoiceDepartment = getTrimmedString(body.firstChoiceDepartment);
	const secondChoiceDepartment = getTrimmedString(body.secondChoiceDepartment);
	const isOpenToAdjustment = Boolean(body.isOpenToAdjustment);
	const skills = getTrimmedString(body.skills);
	const motivation = getTrimmedString(body.motivation);
	const selfIntro = getTrimmedString(body.selfIntro);
	const experience = getTrimmedString(body.experience);
	const hasTechExperience = experience.length > 0;

	if (!name) {
		return sendJson(res, 400, { success: false, message: 'name 不能为空' });
	}

	if (!phone) {
		return sendJson(res, 400, { success: false, message: 'phone 不能为空' });
	}

	if (!isValidChinaPhone(phone)) {
		return sendJson(res, 400, { success: false, message: 'phone 格式不正确，请填写中国大陆手机号' });
	}

	if (!college) {
		return sendJson(res, 400, { success: false, message: 'college 不能为空' });
	}

	if (!gradeMajorClass) {
		return sendJson(res, 400, { success: false, message: 'gradeMajorClass 或 class 不能为空' });
	}

	if (!firstChoiceDepartment) {
		return sendJson(res, 400, { success: false, message: 'firstChoiceDepartment 不能为空' });
	}

	try {
		const result = await pool.query(
			`
				INSERT INTO registrations (
					name,
					college,
					grade_major_class,
					phone,
					first_choice_department,
					second_choice_department,
					is_open_to_adjustment,
					hobbies_or_specialties,
					reason_to_join,
					self_introduction,
					has_tech_experience,
					tech_experience_details
				) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
				RETURNING id, created_at
			`,
			[
				name,
				college,
				gradeMajorClass,
				phone,
				firstChoiceDepartment,
				secondChoiceDepartment || null,
				isOpenToAdjustment,
				skills || null,
				motivation || null,
				selfIntro || null,
				hasTechExperience,
				hasTechExperience ? experience : null,
			],
		);

		const [insertedRow] = result.rows;

		return sendJson(res, 200, {
			success: true,
			message: '报名提交成功',
			data: {
				id: insertedRow.id,
				created_at: insertedRow.created_at,
			},
		});
	} catch (error) {
		console.error('register insert error:', error);
		return sendJson(res, 500, { success: false, message: '服务器内部错误' });
	}
}
