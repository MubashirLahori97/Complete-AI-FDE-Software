permissions = {"staff-1": {"public-faq"}, "manager-1": {"public-faq", "internal-pricing"}}

def allowed_document(user_id, document_id):
    return document_id in permissions.get(user_id, set())

user_id = "staff-1"
for document_id in ["public-faq", "internal-pricing"]:
    result = "allowed" if allowed_document(user_id, document_id) else "forbidden"
    print(document_id, result)
print("Model text cannot change the trusted permission map")
